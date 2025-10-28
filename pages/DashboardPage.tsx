
import React from 'react';
import { User } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface DashboardPageProps {
  user: User;
  onStartQuiz: () => void;
}

const StatCard: React.FC<{ value: string | number; label: string; icon: string }> = ({ value, label, icon }) => (
    <Card className="p-6 flex-1">
        <div className="flex items-center gap-4">
            <div className="text-4xl">{icon}</div>
            <div>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-gray-400">{label}</p>
            </div>
        </div>
    </Card>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onStartQuiz }) => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">{user.name}</span>!</h1>
        <p className="text-gray-400 text-lg mt-1">Ready to conquer your exams? Let's get started.</p>
      </div>

      <Card className="p-8 text-center bg-gradient-to-br from-brand-surface to-transparent">
        <h2 className="text-3xl font-bold mb-4">Start a New Quiz</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-6">Challenge yourself with past questions or let our AI create a custom quiz just for you.</p>
        <Button onClick={onStartQuiz} className="!px-10 !py-4 text-xl">
            Let's Go!
        </Button>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard value={user.streak} label="Day Streak" icon="🔥" />
        <StatCard value="78%" label="Avg. Score" icon="🎯" />
        <StatCard value={user.badges.length} label="Badges Earned" icon="🏆" />
      </div>

       <Card className="p-6">
          <h3 className="text-2xl font-bold mb-4">Recent Activity</h3>
          <ul className="space-y-4">
              <li className="flex justify-between items-center p-4 bg-brand-surface/50 rounded-lg">
                  <div>
                      <p className="font-semibold">Quiz: Photosynthesis</p>
                      <p className="text-sm text-gray-400">Completed 2 hours ago</p>
                  </div>
                  <div className="text-right">
                      <p className="font-bold text-green-400">Score: 85%</p>
                  </div>
              </li>
               <li className="flex justify-between items-center p-4 bg-brand-surface/50 rounded-lg">
                  <div>
                      <p className="font-semibold">Quiz: Algebra</p>
                      <p className="text-sm text-gray-400">Completed yesterday</p>
                  </div>
                  <div className="text-right">
                      <p className="font-bold text-yellow-400">Score: 60%</p>
                  </div>
              </li>
          </ul>
       </Card>
    </div>
  );
};

export default DashboardPage;
