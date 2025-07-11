export type GoalProgress = [
  { name: 'completed'; value: number },
  { name: 'remaining'; value: number }
];

export type SubjectDuration = {
  name: string;
  value: number;
};

export type SegmentedSubjectProgress = {
  segment: string;
  thisMonth: number;
  lastMonth: number;
};
