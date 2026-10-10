#!/usr/bin/env python3
"""Frontend-only production release; each mutating phase is explicit."""
import argparse
from html.parser import HTMLParser
import fcntl
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import shutil
import subprocess
import tempfile
import tarfile
import urllib.request
from urllib.parse import urlsplit

NAME = 'botai-public-frontend-1'
PROJECT = 'botai-public'
OLD_TAG = 'botai-front:release-20261008-ui-v9'
NEW_TAG = 'botai-front:release-20261010-task-profile'
HEAD = '0f5ffd887988704e4061d3f4e57e04885a2deba8'
SOURCE_DIGEST = 'a0d0fb41e53ed1a78e49a7b0499f7ec9b5be2c866dd6ae7379656576f52f5ba3'
ROOT = Path('/srv/botai-public')
RELEASE = ROOT / 'releases/20261010-task-profile'
SOURCE = RELEASE / 'front'
RUNTIME = ROOT / 'runtime'
STATIC = Path('/opt/botai-front/static-public-20261008-ui-v9')
STAGED_STATIC = RELEASE / 'static'
STATE = RELEASE / 'deploy-state.json'
OVERRIDE = RUNTIME / 'frontend-20261010-task-profile.override.json'
BUILDER = 'botai-stage-build'
BUILDKIT = 'buildx_buildkit_botai-stage-build0'
MEMORY = 1610612736
CPUS = 1500000000
SOURCE_ROOT_FILES = {'.dockerignore','.npmrc','.prettierignore','.prettierrc.json','Dockerfile.integration','components.json','eslint.config.mjs','next.config.ts','package-lock.json','package.json','postcss.config.mjs','tsconfig.json'}


def require(condition, message):
    if not condition:
        raise SystemExit(message)


def run(args, *, env=None, stream=False, allowed_failure=False):
    result = subprocess.run(args, env=env, text=True, capture_output=not stream)
    if result.returncode and not allowed_failure:
        # Compose can expand private env values; never echo its captured output.
        raise RuntimeError('Command failed with code '+str(result.returncode)+': '+' '.join(args[:3]))
    return result


def docker_object(kind, name):
    return json.loads(run(['docker', kind, 'inspect', name]).stdout)[0]


def sha(path):
    h = hashlib.sha256()
    with path.open('rb') as source:
        for block in iter(lambda: source.read(1048576), b''):
            h.update(block)
    return h.hexdigest()


def inventory(directory):
    require(directory.is_dir() and not directory.is_symlink(), 'Missing or symlink directory: '+str(directory))
    files = {}
    for path in directory.rglob('*'):
        require(not path.is_symlink(), 'Symlink forbidden: '+str(path))
        if path.is_file():
            files[str(path.relative_to(directory))] = sha(path)
        else:
            require(path.is_dir(), 'Nonregular source entry')
    return files


def digest(files):
    return hashlib.sha256(''.join(n+'\0'+files[n]+'\n' for n in sorted(files)).encode()).hexdigest()


def source_check():
    files = inventory(SOURCE)
    require(len(files) == 639 and digest(files) == SOURCE_DIGEST, 'Source is not the verified 639-file HEAD snapshot')


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix='.'+path.name+'-', dir=path.parent)
    try:
        with os.fdopen(fd, 'w') as target:
            json.dump(value, target, indent=2)
            target.write('\n')
            target.flush()
            os.fsync(target.fileno())
        os.chmod(tmp, 0o600)
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def others():
    ids = run(['docker', 'ps', '-aq', '--filter', 'label=com.docker.compose.project='+PROJECT]).stdout.split()
    rows = {}
    for container_id in ids:
        obj = docker_object('container', container_id)
        if obj['Name'].lstrip('/') == NAME:
            continue
        rows[obj['Name'].lstrip('/')] = {'id':obj['Id'], 'image':obj['Image'], 'started':obj['State']['StartedAt']}
    require(bool(rows), 'No other production containers found')
    return rows


def path_list(raw, label):
    require(bool(raw), 'Missing Compose label '+label)
    result = []
    for value in raw.split(','):
        path = Path(value.strip())
        require(path.is_absolute() and path.is_file() and ROOT in path.resolve().parents, 'Untrusted Compose path')
        result.append(str(path))
    return result


def live():
    obj = docker_object('container', NAME)
    labels = obj['Config'].get('Labels') or {}
    require(labels.get('com.docker.compose.project') == PROJECT, 'Unexpected Compose project')
    require(labels.get('com.docker.compose.service') == 'frontend', 'Unexpected Compose service')
    require(obj['State']['Running'], 'Frontend is not running')
    require(obj['HostConfig']['PortBindings'].get('3000/tcp') == [{'HostIp':'127.0.0.1','HostPort':'13001'}], 'Unexpected frontend port binding')
    workdir = Path(labels.get('com.docker.compose.project.working_dir',''))
    require(workdir.is_absolute() and workdir.is_dir() and ROOT in workdir.resolve().parents, 'Unexpected Compose working directory')
    files = path_list(labels.get('com.docker.compose.project.config_files'), 'config_files')
    env_label = labels.get('com.docker.compose.project.environment_file')
    env_files = path_list(env_label, 'environment_file') if env_label else []
    backend = docker_object('container', 'botai-public-backend-1')
    backend_tag = backend['Config']['Image']
    prefix = 'botai-public-backend:'
    require(backend_tag.startswith(prefix), 'Cannot derive existing backend RELEASE_ID')
    release_id = backend_tag[len(prefix):]
    require(release_id and all(c.isalnum() or c in '-_.' for c in release_id), 'Invalid existing RELEASE_ID')
    ai = docker_object('container', 'botai-public-ai-1')
    require(ai['Config']['Image'] == 'botai-public-ai:'+release_id, 'Backend and AI release tags differ')
    return {'id':obj['Id'], 'image_id':obj['Image'], 'image_tag':obj['Config']['Image'], 'healthy':obj['State'].get('Health',{}).get('Status'), 'working_dir':str(workdir), 'config_files':files, 'environment_files':env_files, 'release_id':release_id}


def compose(meta, override=False):
    args = ['docker','compose','--project-name',PROJECT,'--project-directory',meta['working_dir']]
    for path in meta['environment_files']:
        args += ['--env-file',path]
    for path in meta['config_files']:
        if Path(path) != OVERRIDE:
            args += ['-f',path]
    if override:
        args += ['-f',str(OVERRIDE)]
    env = {k:v for k,v in os.environ.items() if not k.startswith('COMPOSE_')}
    env.update(RELEASE_ID=meta['release_id'], PUBLIC_RUNTIME_DIR=str(RUNTIME))
    return args, env


def resolved(meta, override=False):
    args, env = compose(meta, override)
    return json.loads(run(args+['config','--format','json'],env=env).stdout)


def config_digest(config):
    return hashlib.sha256(json.dumps(config,sort_keys=True,separators=(',',':')).encode()).hexdigest()


def config_gate(meta, old_config, image):
    require(old_config['services']['frontend']['image'] == OLD_TAG, 'Base Compose frontend no longer pins v9')
    write_json(OVERRIDE, {'services':{'frontend':{'image':image,'pull_policy':'never'}}})
    expected = json.loads(json.dumps(old_config))
    expected['services']['frontend'].update(image=image,pull_policy='never')
    require(resolved(meta, True) == expected, 'Compose override changes more than frontend image/pull_policy')


def builder_check():
    obj = docker_object('container', BUILDKIT)
    config = obj['HostConfig']
    require(config['Memory'] == MEMORY and config['MemorySwap'] == MEMORY, 'Builder must have exactly 1.5 GiB RAM and total RAM+swap cap')
    nano = config.get('NanoCpus',0)
    quota, period = config.get('CpuQuota',0), config.get('CpuPeriod',0)
    require(nano == CPUS or (not nano and period > 0 and quota*2 == period*3), 'Builder must be capped at 1.5 CPU')
    return {'running':obj['State']['Running'], 'memory':config['Memory'], 'memory_swap':config['MemorySwap'], 'nano_cpus':nano, 'cpu_quota':quota, 'cpu_period':period}


def caddy_check():
    config = Path('/etc/caddy/Caddyfile')
    require(config.is_file(), 'Expected Caddyfile absent; inspect configuration path manually')
    data = json.loads(run(['caddy','adapt','--config',str(config),'--adapter','caddyfile']).stdout)
    found = []
    def visit(node):
        if isinstance(node, dict):
            matches = node.get('match',[])
            if any('/_next/static/*' in m.get('path',[]) for m in matches):
                roots = []
                def roots_in(value):
                    if isinstance(value,dict):
                        if value.get('handler') == 'vars' and 'root' in value: roots.append(value['root'])
                        for child in value.values(): roots_in(child)
                    elif isinstance(value,list):
                        for child in value: roots_in(child)
                roots_in(node.get('handle',[]))
                found.extend(roots)
            for child in node.values(): visit(child)
        elif isinstance(node,list):
            for child in node: visit(child)
    visit(data)
    require(found == [str(STATIC)], 'Caddy static route is not the pinned reviewed root')
    require(STATIC.is_dir() and STATIC.resolve() == STATIC, 'Static root absent or symlink')
    return sha(config)



def prepare_command(archive):
    require(archive.is_file(), 'Downloaded GitHub source archive is missing')
    require(not SOURCE.exists(), 'Candidate source already exists; inspect it instead of overwriting')
    RELEASE.mkdir(parents=True,exist_ok=True)
    temp = Path(tempfile.mkdtemp(prefix='.source-',dir=RELEASE))
    expected_prefix = 'botai-front-'+HEAD
    seen = set()
    try:
        with tarfile.open(archive,'r:*') as package:
            for member in package:
                path = PurePosixPath(member.name)
                require(not path.is_absolute() and '..' not in path.parts and path.parts[0] == expected_prefix, 'Unexpected GitHub archive root or unsafe path')
                if len(path.parts) == 1:
                    require(member.isdir(), 'Invalid GitHub root entry')
                    continue
                name = str(PurePosixPath(*path.parts[1:]))
                allowed = name in SOURCE_ROOT_FILES or name.startswith(('src/','public/','scripts/'))
                if not allowed or member.isdir():
                    continue
                require(member.isfile() and name not in seen, 'Symlink, nonregular or duplicate source entry')
                seen.add(name)
                target = temp/name
                target.parent.mkdir(parents=True,exist_ok=True)
                with package.extractfile(member) as content, target.open('xb') as output:
                    shutil.copyfileobj(content,output)
                target.chmod(0o755 if member.mode & 0o111 else 0o644)
        files = inventory(temp)
        require(len(files) == 639 and digest(files) == SOURCE_DIGEST, 'Extracted GitHub source differs from verified HEAD allowlist')
        require(not SOURCE.exists(), 'Candidate destination appeared during preparation')
        os.rename(temp,SOURCE)
    except BaseException:
        shutil.rmtree(temp,ignore_errors=True)
        raise
    print('Prepared verified 639-file source '+HEAD+'; digest '+SOURCE_DIGEST)


def inspect_command():
    source_check()
    meta = live()
    require(meta['image_tag'] in (OLD_TAG,NEW_TAG), 'Unexpected live frontend image tag')
    require(docker_object('image',meta['image_tag'])['Id'] == meta['image_id'], 'Live tag/image mismatch')
    config = resolved(meta)
    require(config['services']['frontend']['image'] == OLD_TAG, 'Unexpected base frontend image')
    print(json.dumps({'source_head':HEAD,'source_digest':SOURCE_DIGEST,'frontend':meta,'builder':builder_check(),'caddy_sha256':caddy_check(),'other_containers':others(),'free_bytes':shutil.disk_usage(RELEASE).free},indent=2))


def state_read():
    require(STATE.is_file(), 'No reviewed build state')
    state = json.loads(STATE.read_text())
    require(state.get('head') == HEAD and state.get('source_digest') == SOURCE_DIGEST, 'Foreign build state')
    return state


def extract_static(image_id):
    require(not STAGED_STATIC.exists(), 'Staged static already exists')
    container_id = run(['docker','create','--name','botai-front-extract-20261010-task-profile','--network','none','--read-only',image_id]).stdout.strip()
    try:
        obj = docker_object('container', container_id)
        require(obj['Image'] == image_id and not obj['State']['Running'] and not obj['HostConfig']['PortBindings'], 'Unsafe static extraction container')
        STAGED_STATIC.mkdir()
        run(['docker','cp',container_id+':/app/.next/static/.',str(STAGED_STATIC)])
    finally:
        run(['docker','rm',container_id])
    files = inventory(STAGED_STATIC)
    require(bool(files), 'Built image has no static assets')
    return files


def build_command():
    source_check()
    require(not STATE.exists() and not OVERRIDE.exists(), 'Release state or override already exists; inspect instead of overwriting')
    meta = live()
    require(meta['image_tag'] == OLD_TAG and meta['healthy'] == 'healthy', 'Expected healthy v9 frontend before build')
    require(docker_object('image',OLD_TAG)['Id'] == meta['image_id'], 'Old tag does not match live image')
    require(not builder_check()['running'], 'Dedicated builder is already running; do not interrupt another build')
    require(shutil.disk_usage(RELEASE).free >= 8*1024**3, 'Less than 8 GiB free disk')
    require(run(['docker','image','inspect',NEW_TAG],allowed_failure=True).returncode != 0, 'Candidate image tag already exists')
    before = others()
    config = resolved(meta)
    require(config['services']['frontend']['image'] == OLD_TAG, 'Base Compose frontend differs from live v9')
    state = {'head':HEAD,'source_digest':SOURCE_DIGEST,'before':meta,'other_containers':before,'config_digest':config_digest(config),'caddy_sha256':caddy_check()}
    write_json(STATE,state)
    try:
        run(['docker','buildx','inspect',BUILDER,'--bootstrap'])
        builder_check()
        run(['docker','buildx','build','--builder',BUILDER,'--load','--build-arg','APP_ENV=prod','--build-arg','BACKEND_URL=http://backend:8080','-f',str(SOURCE/'Dockerfile.integration'),'-t',NEW_TAG,str(SOURCE)],stream=True)
    finally:
        run(['docker','buildx','stop',BUILDER])
    obj = docker_object('image',NEW_TAG)
    require(obj.get('Os') == 'linux' and obj.get('Architecture') == 'amd64', 'Unexpected candidate image platform')
    source_check()
    require(live()['id'] == meta['id'] and others() == before, 'Production containers changed during build')
    files = extract_static(obj['Id'])
    state.update(image_id=obj['Id'],static_digest=digest(files),static_files=len(files),built=True)
    write_json(STATE,state)
    print(json.dumps({'built_image':obj['Id'],'static_files':len(files),'static_digest':digest(files),'production_frontend_unchanged':True},indent=2))


def additive_static(files):
    # Validate every conflict and parent before creating even the first asset.
    missing = []
    for name, expected in files.items():
        target = STATIC/name
        for parent in target.parents:
            if parent == STATIC.parent: break
            require(not parent.is_symlink() and (not parent.exists() or parent.is_dir()), 'Static parent conflict')
        if target.exists() or target.is_symlink():
            require(target.is_file() and not target.is_symlink() and sha(target) == expected, 'Static content conflict: '+name)
        else:
            missing.append(name)
    for name in missing:
        target = STATIC/name
        target.parent.mkdir(parents=True,exist_ok=True)
        fd, tmp = tempfile.mkstemp(prefix='.frontend-',dir=target.parent)
        try:
            with os.fdopen(fd,'wb') as output, (STAGED_STATIC/name).open('rb') as source:
                shutil.copyfileobj(source,output)
                output.flush()
                os.fsync(output.fileno())
            os.chmod(tmp,0o644)
            require(sha(Path(tmp)) == files[name], 'Staged static changed during copy')
            try:
                os.link(tmp,target)
            except FileExistsError:
                require(target.is_file() and not target.is_symlink() and sha(target) == files[name], 'Concurrent static conflict')
        finally:
            os.unlink(tmp)
    return len(missing)


def health_gate(image_id):
    current = live()
    require(current['image_id'] == image_id and current['healthy'] == 'healthy', 'Frontend health/image gate failed')
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    with opener.open('http://127.0.0.1:13001/',timeout=15) as response:
        require(response.status == 200, 'Frontend loopback HTTP gate failed')
    with opener.open('https://www.botai-ege.ru/',timeout=20) as response:
        require(response.status == 200, 'Public HTTPS gate failed')
        html = response.read(2*1024*1024)
    class Assets(HTMLParser):
        def __init__(self):
            super().__init__()
            self.paths = set()
        def handle_starttag(self, tag, attrs):
            for key, value in attrs:
                if key in ('src','href') and value and value.startswith('/_next/static/'):
                    self.paths.add(urlsplit(value).path)
    assets = Assets()
    assets.feed(html.decode())
    require(bool(assets.paths), 'No Next static references in public HTML')
    for path in sorted(assets.paths):
        local = STATIC/path.removeprefix('/_next/static/')
        require(local.is_file() and STATIC in local.resolve().parents, 'Public HTML references an absent static asset')
        with opener.open('https://www.botai-ege.ru'+path,timeout=20) as response:
            require(response.status == 200, 'Static HTTPS status failed')
            content = response.read(16*1024*1024+1)
        require(hashlib.sha256(content).hexdigest() == sha(local), 'Static HTTPS bytes differ from the pinned root')


def switch(state, image, image_id):
    require(others() == state['other_containers'], 'Other production containers changed; inspect before proceeding')
    config = resolved(state['before'])
    require(config_digest(config) == state['config_digest'], 'Base Compose configuration changed')
    require(caddy_check() == state['caddy_sha256'], 'Caddy configuration changed')
    config_gate(state['before'],config,image)
    args, env = compose(state['before'],True)
    run(args+['up','-d','--no-deps','--no-build','--pull','never','--wait','--wait-timeout','120','frontend'],env=env)
    require(others() == state['other_containers'], 'Other production containers changed after frontend switch')
    health_gate(image_id)


def publish_command():
    source_check()
    state = state_read()
    require(state.get('built') and not state.get('published'), 'Candidate not built or already published')
    require(live()['id'] == state['before']['id'], 'Live frontend changed after reviewed build')
    require(docker_object('image',NEW_TAG)['Id'] == state['image_id'], 'Candidate image tag changed')
    files = inventory(STAGED_STATIC)
    require(len(files) == state['static_files'] and digest(files) == state['static_digest'], 'Staged static changed')
    require(caddy_check() == state['caddy_sha256'], 'Caddy configuration changed')
    config = resolved(state['before'])
    require(config_digest(config) == state['config_digest'], 'Base Compose configuration changed')
    require(others() == state['other_containers'], 'Other production containers changed')
    added = additive_static(files)
    state['switch_started'] = True
    write_json(STATE,state)
    try:
        switch(state,NEW_TAG,state['image_id'])
    except BaseException:
        print('Publish gate failed. Run this script with rollback; no backend/database rollback is needed.')
        raise
    state.update(published=True,added_static=added)
    write_json(STATE,state)
    print(json.dumps({'published_image':state['image_id'],'added_static_files':added,'other_containers_unchanged':True,'browser_acceptance_still_required':True},indent=2))


def rollback_command():
    state = state_read()
    require(state.get('switch_started'), 'No attempted frontend switch to roll back')
    require(docker_object('image',OLD_TAG)['Id'] == state['before']['image_id'], 'Original image tag changed')
    current = docker_object('container',NAME)
    require(current['Image'] in (state['image_id'],state['before']['image_id']), 'Live frontend is a different release')
    switch(state,OLD_TAG,state['before']['image_id'])
    state.update(published=False,rolled_back=True)
    write_json(STATE,state)
    print('Original v9 frontend restored; additive assets retained; other containers unchanged')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command',choices=['prepare','inspect','build','publish','rollback'])
    parser.add_argument('--archive',type=Path,default=Path('/tmp/front.tar.gz'))
    arguments = parser.parse_args()
    command = arguments.command
    require(os.geteuid() == 0, 'Run as server root')
    if command == 'inspect':
        inspect_command()
        return
    require(RUNTIME.is_dir(), 'Production runtime directory missing')
    with (RUNTIME/'frontend-release.lock').open('a') as lock:
        os.chmod(lock.name,0o600)
        try:
            fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
        except BlockingIOError:
            raise SystemExit('Another frontend release action holds the lock')
        if command == 'prepare':
            prepare_command(arguments.archive)
        else:
            {'build':build_command,'publish':publish_command,'rollback':rollback_command}[command]()


if __name__ == '__main__':
    main()
