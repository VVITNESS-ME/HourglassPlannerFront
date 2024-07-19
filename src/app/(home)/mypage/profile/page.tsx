'use client';

import React, { useEffect, useState } from 'react';
import TitleList from '@/components/mypage/profile/titleList';
import ProfileCard from '@/components/mypage/profile/profileCard';
import CategorySettings from "@/components/mypage/profile/categorySettings";
import useAuthStore from "../../../../../store/(auth)/authStore";
import useTitleStore from "../../../../../store/titleStore";

interface Title {
  id: number;
  name: string;
  achieveCondition: string;
  titleColor: string;
}

interface UserInfo {
  userEmail: string;
  userName: string;
  main_title: Title;
}

interface UserCategory {
  categoryId: number;
  categoryName: string;
  color: string;
}

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userCategories, setUserCategories] = useState<UserCategory[]>([]);
  const { mainTitle, fetchTitles } = useTitleStore();
  const { username, email, isInitialized, initialize } = useAuthStore(state => ({
    username: state.username,
    email: state.email,
    isInitialized: state.isInitialized,
    initialize: state.initialize,
  }));

  const handleAddCategory = async (category: { categoryName: string; color: string }) => {
    const maxId = userCategories.reduce((max, category) => (category.categoryId > max ? category.categoryId : max), 0);
    const newCategoryId = maxId + 1;

    const newCategory = {
      categoryId: newCategoryId,
      categoryName: category.categoryName,
      color: category.color,
    };

    setUserCategories(prevCategories => [...prevCategories, newCategory]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
      fetchTitles();
      setUserInfo({
        userEmail: email,
        userName: username,
        main_title: {
          id: mainTitle?.id ?? 0,
          name: mainTitle?.name ?? '',
          achieveCondition: mainTitle?.achieveCondition ?? '',
          titleColor: mainTitle?.titleColor ?? '',
        },
      });
    }
  }, []);

  useEffect(() => {
    fetchCategoriesInfo();
  }, []);

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
          <TitleList/>
        </div>
        <div className="flex-1 min-w-[400px] max-w-[700px] mb-4">
        </div>
      </div>
    </div>
  );
};

export default Profile;
