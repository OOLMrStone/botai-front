// Запускается в read-only DOM контексте браузерного предпросмотра.
export function checkDesignGeometry() {
  const tolerance = 1;
  const textScale = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
  const results = [];
  const rect = (node) => node.getBoundingClientRect();
  const visible = (node) => rect(node).width > 0 && rect(node).height > 0;
  const check = (name, pass, measured) => results.push({ name, pass, measured });
  const capsule = (node) => {
    const box = rect(node);
    const style = getComputedStyle(node);
    const radii = [
      'borderTopLeftRadius',
      'borderTopRightRadius',
      'borderBottomLeftRadius',
      'borderBottomRightRadius',
    ].map((key) => Number.parseFloat(style[key]));
    const required = Math.min(box.width, box.height) / 2;
    const [tl, tr, bl, br] = radii;
    const factor = Math.min(
      1,
      box.width / (tl + tr),
      box.width / (bl + br),
      box.height / (tl + bl),
      box.height / (tr + br),
    );
    const effective = radii.map((radius) => radius * factor);
    check(
      `G3 capsule: ${node.getAttribute('aria-label') || node.textContent?.trim() || node.tagName}`,
      effective.every((radius) => Math.abs(radius - required) <= tolerance),
      { effective, required },
    );
  };
  const bar = document.querySelector('[data-slot="progress"]');
  if (bar?.closest('header')) {
    const parent = rect(bar.closest('header'));
    const box = rect(bar);
    const left = box.left - parent.left;
    const right = parent.right - box.right;
    check('G1 centered progress', Math.abs(left - right) <= tolerance, { left, right });
  }
  const footer = document.querySelector('footer');
  const field = document.querySelector('footer input:not([type="file"])');
  if (footer && footer.querySelector('button')) {
    const controls = [
      ...footer.querySelectorAll(
        ':scope > [data-slot="button"], :scope > div input:not([type="file"])',
      ),
    ].filter(visible);
    if (controls.length >= 2) {
      const boxes = controls.map(rect);
      const topSpread = Math.max(...boxes.map((b) => b.top)) - Math.min(...boxes.map((b) => b.top));
      const bottomSpread =
        Math.max(...boxes.map((b) => b.bottom)) - Math.min(...boxes.map((b) => b.bottom));
      check('G2 aligned controls', topSpread <= tolerance && bottomSpread <= tolerance, {
        topSpread,
        bottomSpread,
      });
      check(
        'G4 footer inside viewport',
        boxes.every(
          (b) =>
            b.left >= 0 && b.right <= innerWidth + tolerance && b.bottom <= innerHeight + tolerance,
        ),
        boxes.map((b) => ({ left: b.left, right: b.right, bottom: b.bottom })),
      );
      controls.forEach(capsule);
      check(
        'G6 standard control height',
        boxes.every((box) => Math.abs(box.height - 48 * textScale) <= tolerance),
        boxes.map((box) => box.height),
      );
      check(
        'G4 labels fit controls',
        controls.every(
          (node) =>
            node.scrollHeight <= node.clientHeight + tolerance &&
            node.scrollWidth <= node.clientWidth + tolerance,
        ),
        controls.map((node) => ({
          text: node.textContent,
          content: node.scrollHeight,
          available: node.clientHeight,
        })),
      );
    }
  }
  const actionControls = [
    ...document.querySelectorAll(
      '[data-slot="button"]:not([data-control-size="card"]):not([data-control-size="segment"]), button.rounded-control',
    ),
  ].filter(visible);
  actionControls.forEach(capsule);
  for (const node of actionControls) {
    const size = node.getAttribute('data-control-size');
    if (!size) continue;
    const box = rect(node);
    if (size.startsWith('icon'))
      check('G3 circular icon control', Math.abs(box.width - box.height) <= tolerance, {
        width: box.width,
        height: box.height,
      });
    const expected = (size.includes('compact') ? 44 : 48) * textScale;
    check(
      'G6 role size: ' + (node.textContent || node.getAttribute('aria-label')),
      Math.abs(rect(node).height - expected) <= tolerance,
      { height: rect(node).height, expected },
    );
  }
  for (const node of [...document.querySelectorAll('.rounded-card')].filter(visible)) {
    check(
      'G5 card radius',
      Number.parseFloat(getComputedStyle(node).borderTopLeftRadius) === 24 * textScale,
      getComputedStyle(node).borderTopLeftRadius,
    );
  }
  if (field)
    check(
      'G4 readable input',
      Number.parseFloat(getComputedStyle(field).fontSize) >= 16,
      getComputedStyle(field).fontSize,
    );
  check(
    'G4 no horizontal overflow',
    document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth },
  );
  const setup = document.querySelector('[data-activity-setup]');
  if (setup) {
    const close = setup.querySelector('header button');
    const ink = close?.querySelector('svg path');
    const heading = setup.querySelector('h1');
    if (close && ink && heading) {
      const offset = rect(ink).left - rect(heading).left;
      const target = rect(close);
      check('G7 close icon aligns with text', Math.abs(offset) <= tolerance * textScale, {
        offset,
      });
      check('G7 close focus fits screen gutter', target.left - rect(setup).left >= 3 * textScale, {
        inset: target.left - rect(setup).left,
        width: target.width,
      });
    }
  }
  const navigation = document.querySelector('nav [aria-current="page"]')?.closest('nav');
  const main = navigation?.parentElement?.querySelector(':scope > main');
  if (navigation && main && getComputedStyle(navigation).flexDirection === 'column') {
    const navBox = rect(navigation);
    const mainBox = rect(main);
    check('G8 desktop sidebar does not overlap content', navBox.right <= mainBox.left + tolerance, {
      navigationRight: navBox.right,
      contentLeft: mainBox.left,
    });
    check(
      'G8 desktop sidebar fits viewport',
      navBox.top >= -tolerance && navBox.bottom <= innerHeight + tolerance,
      {
        top: navBox.top,
        bottom: navBox.bottom,
      },
    );
  }
  return results;
}
