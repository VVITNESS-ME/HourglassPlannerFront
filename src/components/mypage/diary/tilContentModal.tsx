import React from 'react';

interface TilContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  til: {
    title: string | null;
    content: string | null;
  } | null;
}

const TilContentModal: React.FC<TilContentModalProps> = ({ isOpen, onClose, til }) => {
  if (!isOpen || !til) return null;

  const formattedContent = til.content?.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded mypage-md max-w-lg w-full">
        <h2 className="text-2xl mb-4">{til.title}</h2>
        <p className="text-gray-700">{formattedContent}</p>
        <button onClick={onClose} className="mt-4 bg-red-500 text-black py-2 px-4 rounded">
          닫기
        </button>
      </div>
    </div>
  );
};

export default TilContentModal;
