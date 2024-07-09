'use client';

import React, { useEffect, useState } from 'react';
import TitleList from '@/components/mypage/profile/titleList';
import ProfileCard from '@/components/mypage/profile/profileCard';
import CategorySettings from "@/components/mypage/profile/categorySettings";
import useAuthStore from "../../../../../store/(auth)/authStore";

interface Title {
  titleId: bigint;
  name: string;
  description: string;
  color: string;
}

interface UserInfo {
  userEmail: string;
  userName: string;
  main_title: bigint;
}

interface UserCategory {
  categoryId: bigint;
  categoryName: string;
  color: string;
}

const Profile: React.FC = () => {
  const [titles, setTitles] = useState<Title[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [mainTitle, setMainTitle] = useState<Title | null>(null);
  const [userCategories, setUserCategories] = useState<UserCategory[]>([]);
  const { username, email, isInitialized, initialize } = useAuthStore(state => ({
    username: state.username,
    email: state.email,
    isInitialized: state.isInitialized,
    initialize: state.initialize,
  }));

  const handleAddCategory = async (category: { categoryName: string; color: string }) => {
    // Calculate the new ID
    const maxId = userCategories.reduce((max, category) => (category.categoryId > max ? category.categoryId : max), BigInt(0));
    const newCategoryId = maxId + BigInt(1);

    const newCategory: { categoryId: bigint; color: string; categoryName: string } = {
      categoryId: newCategoryId,
      categoryName: category.categoryName,
      color: category.color,
    };

    // Optimistically update the UI
    setUserCategories((prevCategories) => [...prevCategories, newCategory]);

    // Attempt to add the category to the server
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        console.log('Category added successfully');
      } else {
        console.error('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category', error);
    }
  };

  const fetchCategoriesInfo = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-category`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setUserCategories(data.data.userCategoriesWithName);
      }
    } catch (error) {
      console.error('Error fetching profile info', error);
    }
  };

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized) {
      setUserInfo({
        userEmail: email,
        userName: username,
        main_title: BigInt(1),
      });

      const testTitleData = [
        { titleId: BigInt(1), name: '망부석', description: '3시간 동안 자리이탈/졸음 없음', color: '#228B22' },
        { titleId: BigInt(2), name: '원펀맨', description: '운동 카테고리 100시간 달성', color: '#1E90FF' },
        { titleId: BigInt(3), name: '전 집중 호흡', description: '1시간 동안 자리이탈/졸음 없음', color: '#8A2BE2' },
        { titleId: BigInt(4), name: '시작이 반', description: '10분 모래시계 완료', color: '#FFD700' },
        { titleId: BigInt(5), name: '그건 제 잔상입니다만', description: '30분 이내 10회 이상 자리이탈/졸음', color: '#FF69B4' },
        { titleId: BigInt(6), name: '망부석', description: '3시간 동안 자리이탈/졸음 없음', color: '#228B22' },
        { titleId: BigInt(7), name: '원펀맨', description: '운동 카테고리 100시간 달성', color: '#1E90FF' },
        { titleId: BigInt(8), name: '전 집중 호흡', description: '1시간 동안 자리이탈/졸음 없음', color: '#8A2BE2' },
        { titleId: BigInt(9), name: '시작이 반', description: '10분 모래시계 완료', color: '#FFD700' },
        { titleId: BigInt(10), name: '그건 제 잔상입니다만', description: '30분 이내 10회 이상 자리이탈/졸음', color: '#FF69B4' },
        { titleId: BigInt(11), name: '망부석', description: '3시간 동안 자리이탈/졸음 없음', color: '#228B22' },
        { titleId: BigInt(12), name: '원펀맨', description: '운동 카테고리 100시간 달성', color: '#1E90FF' },
        { titleId: BigInt(13), name: '전 집중 호흡', description: '1시간 동안 자리이탈/졸음 없음', color: '#8A2BE2' },
        { titleId: BigInt(14), name: '시작이 반', description: '10분 모래시계 완료', color: '#FFD700' },
        { titleId: BigInt(15), name: '그건 제 잔상입니다만', description: '30분 이내 10회 이상 자리이탈/졸음', color: '#FF69B4' },
      ];
      setTitles(testTitleData);
      fetchCategoriesInfo();
    }
  }, [isInitialized, email, username]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
        <div className="flex-1 min-w-[400px] max-w-[700px] mb-4">
          <ProfileCard userInfo={userInfo} mainTitle={mainTitle} />
        </div>
        <div className="flex-1 min-w-[400px] max-w-[700px] mb-4">
          <CategorySettings categories={userCategories} setCategories={setUserCategories} onAddCategory={handleAddCategory} />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
        <div className="flex-1 min-w-[400px] max-w-[700px] mb-4">
          <TitleList titles={titles} setUserInfo={setUserInfo} />
        </div>
        <div className="flex-1 min-w-[400px] max-w-[700px] mb-4">
        </div>
      </div>
    </div>
  );
};

export default Profile;