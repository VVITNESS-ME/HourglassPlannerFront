import React from 'react';
import styles from './AchievementModal.module.css'; // CSS 모듈을 임포트

interface AchievementModalProps {
  title: string;
  onClose: () => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({ title, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-lg overflow-hidden shadow-lg w-96 transform transition-all duration-300 ease-in-out scale-110">
        <div className="p-6 text-center relative z-10">
          <h2 className="text-2xl font-bold text-green-500 mb-4 animate-bounce">Congratulations!</h2>
          <p className="text-lg text-gray-700 mb-4">You have achieved:</p>
          <p className="text-xl font-semibold text-blue-500 mb-6">{title}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-700 transition-colors duration-300"
          >
            Close
          </button>
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="absolute w-80 h-80 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full blur-2xl opacity-70 animate-spin-slow"></div>
        </div>
      </div>
      {/* 빵빠레 효과 추가 */}
      <div className={styles.fireworks}>
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`${styles.firework} ${styles[`firework-${i % 5}`]}`}></div>
        ))}
      </div>
    </div>
  );
};

export default AchievementModal;
