import React, { useState } from 'react';
import { CourseGradeRow } from '../types';
import { GRADE_SCALE } from '../data/mockData';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

const INITIAL_COURSES: CourseGradeRow[] = [
  { id: 'c-1', code: 'CS-341', title: 'Data Structures & Algorithms', credits: 4, grade: 'A' },
  { id: 'c-2', code: 'MATH-280', title: 'Multivariate Calculus & Linear Alg', credits: 4, grade: 'A-' },
  { id: 'c-3', code: 'PHYS-201', title: 'University Physics II', credits: 4, grade: 'B+' },
  { id: 'c-4', code: 'ENG-105', title: 'Academic Research & Composition', credits: 3, grade: 'A' },
  { id: 'c-5', code: 'HIST-210', title: 'Modern Global History', credits: 3, grade: 'B' },
];

export const GpaCalculator: React.FC = () => {
  const [courses, setCourses] = useState<CourseGradeRow[]>(INITIAL_COURSES);
  const [priorCredits, setPriorCredits] = useState<number>(45);
  const [priorCgpa, setPriorCgpa] = useState<number>(3.62);
  const [targetCgpa, setTargetCgpa] = useState<number>(3.75);

  const addCourse = () => {
    const newCourse: CourseGradeRow = {
      id: `c-${Date.now()}`,
      code: `CRS-${Math.floor(100 + Math.random() * 899)}`,
      title: 'Elective Course',
      credits: 3,
      grade: 'A',
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseGradeRow, val: any) => {
    setCourses(
      courses.map((c) => {
        if (c.id === id) {
          return { ...c, [field]: val };
        }
        return c;
      })
    );
  };

  const resetCourses = () => {
    setCourses(INITIAL_COURSES);
  };

  const termCredits = courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);
  const termPoints = courses.reduce((acc, c) => {
    const pt = GRADE_SCALE[c.grade] ?? 0;
    return acc + pt * (Number(c.credits) || 0);
  }, 0);

  const termGpa = termCredits > 0 ? termPoints / termCredits : 0;

  const totalCompletedCredits = (Number(priorCredits) || 0) + termCredits;
  const totalCumulativePoints =
    (Number(priorCredits) || 0) * (Number(priorCgpa) || 0) + termPoints;
  const projectedCgpa =
    totalCompletedCredits > 0 ? totalCumulativePoints / totalCompletedCredits : 0;

  const nextSemesterCredits = 15;
  const neededPoints =
    targetCgpa * (totalCompletedCredits + nextSemesterCredits) - totalCumulativePoints;
  const neededAverageGpa = neededPoints / nextSemesterCredits;

  return (
    <div className="w-full">
      {/* Editorial Hero */}
      <div className="py-16 sm:py-20 px-6 sm:px-10 text-center border-b border-[rgba(26,26,26,0.08)] bg-[#fdfdfc]">
        <span className="font-mono-space text-[#a37d58] tracking-[0.14em] block mb-2 font-semibold">
          Academic Honor Standing
        </span>
        <h1 className="font-serif-cormorant text-4xl sm:text-6xl md:text-[4.5rem] font-light tracking-tight text-[#1a1a1a] leading-tight my-4">
          GPA & CGPA Forecaster
        </h1>
        <p className="text-sm sm:text-lg text-[#666] max-w-2xl mx-auto leading-relaxed">
          Simulate term quality points, model cumulative GPA shifts, and forecast honors degree eligibility.
        </p>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-12">
        {/* Metric Triad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-[rgba(26,26,26,0.08)]">
          <div className="space-y-1">
            <span className="font-mono-space text-[#666]">Current Term GPA</span>
            <div className="font-serif-cormorant text-5xl sm:text-6xl text-[#1a1a1a] font-normal tabular-nums">
              {termGpa.toFixed(2)}
            </div>
            <span className="font-mono-space text-[#888] block pt-1">
              {termCredits} Term Credits · {termPoints.toFixed(1)} Points
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-mono-space text-[#a37d58]">Projected Cumulative CGPA</span>
            <div className="font-serif-cormorant text-5xl sm:text-6xl text-[#a37d58] font-normal tabular-nums">
              {projectedCgpa.toFixed(2)}
            </div>
            <span className="font-mono-space text-[#888] block pt-1">
              {totalCompletedCredits} Total Degree Credits
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-mono-space text-[#666]">Academic Standing</span>
            <div className="font-serif-cormorant text-2xl sm:text-3xl text-[#1a1a1a] font-semibold pt-2">
              {projectedCgpa >= 3.85
                ? 'Summa Cum Laude Honors'
                : projectedCgpa >= 3.5
                ? "Dean's Honor Roll"
                : projectedCgpa >= 2.0
                ? 'Good Academic Standing'
                : 'Advising Probation'}
            </div>
            <span className="font-mono-space text-[#888] block pt-1">
              Minimum for graduation: 2.00 CGPA
            </span>
          </div>
        </div>

        {/* 2-Column Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 sm:gap-16">
          {/* Courses Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(26,26,26,0.08)]">
              <span className="font-mono-space text-[#888]">Enrolled Courses ({courses.length})</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetCourses}
                  className="font-mono-space text-[#666] hover:text-[#1a1a1a] cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={addCourse}
                  className="font-mono-space text-[#1a1a1a] font-bold border-b border-[#1a1a1a] pb-0.5 cursor-pointer"
                >
                  + Add Course
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[rgba(26,26,26,0.08)] font-mono-space text-[#888]">
                    <th className="py-3 px-2">Code</th>
                    <th className="py-3 px-2">Course Title</th>
                    <th className="py-3 px-2 w-20">Credits</th>
                    <th className="py-3 px-2 w-28">Grade</th>
                    <th className="py-3 px-2 text-right">Points</th>
                    <th className="py-3 px-2 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(26,26,26,0.06)]">
                  {courses.map((course) => {
                    const gradeVal = GRADE_SCALE[course.grade] ?? 0;
                    const points = gradeVal * (Number(course.credits) || 0);

                    return (
                      <tr key={course.id} className="hover:bg-[#f8f8f5]/50">
                        <td className="py-2.5 px-2">
                          <input
                            type="text"
                            value={course.code}
                            onChange={(e) => updateCourse(course.id, 'code', e.target.value)}
                            className="w-20 font-mono-space uppercase bg-transparent border-b border-[#ccc] focus:border-[#1a1a1a] focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-2">
                          <input
                            type="text"
                            value={course.title}
                            onChange={(e) => updateCourse(course.id, 'title', e.target.value)}
                            className="w-full bg-transparent border-b border-[#eee] focus:border-[#1a1a1a] focus:outline-none text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-2">
                          <select
                            value={course.credits}
                            onChange={(e) =>
                              updateCourse(course.id, 'credits', Number(e.target.value))
                            }
                            className="font-mono-space bg-white border border-[rgba(26,26,26,0.15)] px-2 py-1"
                          >
                            {[1, 2, 3, 4, 5].map((cr) => (
                              <option key={cr} value={cr}>
                                {cr}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-2">
                          <select
                            value={course.grade}
                            onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                            className="font-mono-space font-bold bg-white border border-[rgba(26,26,26,0.15)] px-2 py-1"
                          >
                            {Object.keys(GRADE_SCALE).map((g) => (
                              <option key={g} value={g}>
                                {g} ({GRADE_SCALE[g].toFixed(1)})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono-space text-[#1a1a1a] font-bold">
                          {points.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <button
                            onClick={() => removeCourse(course.id)}
                            className="text-[#999] hover:text-[#991b1b] cursor-pointer"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Inputs */}
          <div className="space-y-8">
            <div className="p-6 border border-[rgba(26,26,26,0.1)] bg-white space-y-4">
              <span className="font-mono-space text-[#1a1a1a] font-bold block">
                Prior Academic Record
              </span>

              <div>
                <label className="font-mono-space text-[#888] block mb-1 text-[10px]">
                  Prior Completed Credits:
                </label>
                <input
                  type="number"
                  value={priorCredits}
                  onChange={(e) => setPriorCredits(Number(e.target.value) || 0)}
                  className="w-full p-2 border border-[rgba(26,26,26,0.15)] font-mono-space text-xs"
                />
              </div>

              <div>
                <label className="font-mono-space text-[#888] block mb-1 text-[10px]">
                  Prior Cumulative CGPA:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={priorCgpa}
                  onChange={(e) => setPriorCgpa(Number(e.target.value) || 0)}
                  className="w-full p-2 border border-[rgba(26,26,26,0.15)] font-mono-space text-xs"
                />
              </div>
            </div>

            <div className="p-6 border border-[#a37d58]/30 bg-[#fffdf9] space-y-4">
              <span className="font-mono-space text-[#a37d58] font-bold block">
                Target Graduation Goal
              </span>

              <div>
                <label className="font-mono-space text-[#888] block mb-1 text-[10px]">
                  Desired Cumulative CGPA:
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={targetCgpa}
                  onChange={(e) => setTargetCgpa(Number(e.target.value) || 0)}
                  className="w-full p-2 border border-[rgba(26,26,26,0.15)] font-mono-space text-xs"
                />
              </div>

              <p className="text-xs text-[#555] leading-relaxed">
                To graduate with <strong className="font-mono-space">{targetCgpa.toFixed(2)}</strong>, you must maintain a term average of:{' '}
                <strong className={`font-mono-space ${neededAverageGpa > 4.0 ? 'text-[#991b1b]' : 'text-[#1a1a1a]'}`}>
                  {neededAverageGpa > 4.0 ? '> 4.00 (Unattainable in 15 cr)' : neededAverageGpa.toFixed(2)}
                </strong>{' '}
                over your next 15 credits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
