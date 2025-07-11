import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { SegmentedSubjectProgress } from '../types';
import type { FirebaseUserId } from '@/types/core';
import { getSessionsByUser } from '@/features/sessions';
import { get7SegmentProgressForSubject } from '../services/charts';

export function SubjectProgressChart({
  userId,
  subject,
}: {
  userId: FirebaseUserId;
  subject: string;
}) {
  const [data, setData] = useState<SegmentedSubjectProgress[] | null>(null);
  useEffect(() => {
    if (data || !userId) return;

    const fetch = async () => {
      try {
        const userSessions = await getSessionsByUser(userId);
        // TODO: later get the user sessions from context or cache
        const progress = get7SegmentProgressForSubject(subject, userSessions);
        setData(progress);
      } catch (err) {
        console.error(
          'Failed to fetch the segmented progress of subject.',
          err
        );
      }
    };

    fetch();
  }, [data, userId]);

  if (!data || !userId) return null;

  {
    return (
      <ResponsiveContainer
        width="100%"
        height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}>
          <CartesianGrid
            strokeDasharray="50 0"
            vertical={false}
            opacity={0.5}
          />
          <XAxis dataKey="segment" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="lastMonth"
            name="Last Month"
            stroke="#8884d8"
          />
          <Line
            type="monotone"
            dataKey="thisMonth"
            name="This Month"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
