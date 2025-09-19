export type GoalProgress = [
  { name: 'completed'; value: number },
  { name: 'remaining'; value: number }
];

export type SubjectDuration = {
  subjectId: string;
  duration: number;
};

export type SegmentedSubjectProgress = {
  segment: string;
  thisMonth: number;
  lastMonth: number;
};

export type WeeklyProgress = {
  week: string;
  [month: string]: number | string;
};
