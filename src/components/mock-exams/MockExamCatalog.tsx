'use client';

import { Check, ChevronDown, ListFilter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { MockExamCard } from '@/components/mock-exams/MockExamCard';
import { MockExamDetails } from '@/components/mock-exams/MockExamDetails';
import {
  MOCK_EXAM_COPY,
  MOCK_EXAM_LAYOUT,
  mockExamPath,
  type MockExam,
  type MockExamFilter,
  type MockExamSort,
} from '@/config/mock-exams';
import { useMockExamSortMenu } from '@/hooks/use-mock-exam-sort-menu';
import { filterMockExams, sortMockExams } from '@/lib/mock-exams';
import { cn } from '@/lib/utils';
import { useMockExamsStore } from '@/stores/mock-exams-store';

export function MockExamCatalog({ exams }: { exams: MockExam[] }) {
  const router = useRouter();
  const [detailsExamId, setDetailsExamId] = useState<string>();
  const sort = useMockExamsStore((state) => state.sort);
  const filter = useMockExamsStore((state) => state.filter);
  const sessions = useMockExamsStore((state) => state.sessions);
  const results = useMockExamsStore((state) => state.results);
  const setSort = useMockExamsStore((state) => state.setSort);
  const setFilter = useMockExamsStore((state) => state.setFilter);
  const start = useMockExamsStore((state) => state.start);
  const visibleExams = filterMockExams(sortMockExams(exams, sort, results), filter, results);
  const detailsExam = exams.find((exam) => exam.id === detailsExamId);
  const {
    open: sortOpen,
    rootRef: sortRootRef,
    triggerRef: sortTriggerRef,
    setOpen: setSortOpen,
    onTriggerKeyDown: onSortTriggerKeyDown,
    onMenuKeyDown: onSortMenuKeyDown,
  } = useMockExamSortMenu();
  const {
    open: filterOpen,
    rootRef: filterRootRef,
    triggerRef: filterTriggerRef,
    setOpen: setFilterOpen,
    onTriggerKeyDown: onFilterTriggerKeyDown,
    onMenuKeyDown: onFilterMenuKeyDown,
  } = useMockExamSortMenu();
  const selectedSort = MOCK_EXAM_COPY.sortOptions.find((option) => option.id === sort);
  const selectedFilter = MOCK_EXAM_COPY.filterOptions.find((option) => option.id === filter);

  return (
    <>
      <div className={MOCK_EXAM_LAYOUT.toolbar}>
        <div ref={sortRootRef} className={MOCK_EXAM_LAYOUT.sortRoot}>
          <button
            ref={sortTriggerRef}
            type="button"
            className={MOCK_EXAM_LAYOUT.sortTrigger}
            aria-label={MOCK_EXAM_COPY.sortLabel}
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
            onClick={() => setSortOpen((currentOpen) => !currentOpen)}
            onKeyDown={onSortTriggerKeyDown}
          >
            <span>{selectedSort?.label}</span>
            <ChevronDown
              aria-hidden="true"
              className={cn(
                MOCK_EXAM_LAYOUT.sortChevron,
                sortOpen && MOCK_EXAM_LAYOUT.sortChevronOpen,
              )}
            />
          </button>
          {sortOpen ? (
            <div
              className={MOCK_EXAM_LAYOUT.sortMenu}
              role="listbox"
              aria-label={MOCK_EXAM_COPY.sortLabel}
              onKeyDown={onSortMenuKeyDown}
            >
              {MOCK_EXAM_COPY.sortOptions.map((option) => {
                const selected = option.id === sort;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={MOCK_EXAM_LAYOUT.sortOption}
                    onClick={() => {
                      setSort(option.id as MockExamSort);
                      setSortOpen(false);
                      sortTriggerRef.current?.focus();
                    }}
                  >
                    {selected ? (
                      <Check aria-hidden="true" className={MOCK_EXAM_LAYOUT.sortCheck} />
                    ) : (
                      <span className={MOCK_EXAM_LAYOUT.sortCheckPlaceholder} />
                    )}
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
        <div ref={filterRootRef} className={MOCK_EXAM_LAYOUT.sortRoot}>
          <button
            ref={filterTriggerRef}
            type="button"
            className={MOCK_EXAM_LAYOUT.filterTrigger}
            aria-label={`${MOCK_EXAM_COPY.filterLabel}: ${selectedFilter?.label}`}
            aria-haspopup="listbox"
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen((currentOpen) => !currentOpen)}
            onKeyDown={onFilterTriggerKeyDown}
          >
            <ListFilter aria-hidden="true" className={MOCK_EXAM_LAYOUT.filterIcon} />
            <ChevronDown
              aria-hidden="true"
              className={cn(
                MOCK_EXAM_LAYOUT.sortChevron,
                filterOpen && MOCK_EXAM_LAYOUT.sortChevronOpen,
              )}
            />
            {filter !== 'all' ? (
              <span aria-hidden="true" className={MOCK_EXAM_LAYOUT.filterIndicator} />
            ) : null}
          </button>
          {filterOpen ? (
            <div
              className={cn(MOCK_EXAM_LAYOUT.sortMenu, 'right-0 left-auto w-60')}
              role="listbox"
              aria-label={MOCK_EXAM_COPY.filterLabel}
              onKeyDown={onFilterMenuKeyDown}
            >
              {MOCK_EXAM_COPY.filterOptions.map((option) => {
                const selected = option.id === filter;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={MOCK_EXAM_LAYOUT.sortOption}
                    onClick={() => {
                      setFilter(option.id as MockExamFilter);
                      setFilterOpen(false);
                      filterTriggerRef.current?.focus();
                    }}
                  >
                    {selected ? (
                      <Check aria-hidden="true" className={MOCK_EXAM_LAYOUT.sortCheck} />
                    ) : (
                      <span className={MOCK_EXAM_LAYOUT.sortCheckPlaceholder} />
                    )}
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
      <div className={MOCK_EXAM_LAYOUT.list}>
        {visibleExams.map((exam) => (
          <MockExamCard
            key={exam.id}
            exam={exam}
            result={results[exam.id]}
            session={sessions[exam.id]}
            onOpen={() => {
              if (results[exam.id]) {
                setDetailsExamId(exam.id);
                return;
              }
              start(exam.id);
              router.push(mockExamPath(exam.id));
            }}
          />
        ))}
        {visibleExams.length === 0 ? (
          <p className={MOCK_EXAM_LAYOUT.emptyFilter}>{MOCK_EXAM_COPY.emptyFilter}</p>
        ) : null}
      </div>
      <MockExamDetails
        exam={detailsExam}
        result={detailsExamId ? results[detailsExamId] : undefined}
        onClose={() => setDetailsExamId(undefined)}
        onView={() => {
          if (!detailsExam) return;
          start(detailsExam.id);
          router.push(mockExamPath(detailsExam.id));
        }}
      />
    </>
  );
}
