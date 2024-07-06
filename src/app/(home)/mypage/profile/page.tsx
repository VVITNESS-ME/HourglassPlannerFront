'use client';

import React, { useEffect, useState } from 'react';
import TitleList from '@/components/mypage/profile/titleList';
import ProfileCard from '@/components/mypage/profile/profileCard';
import CategorySettings from "@/components/mypage/profile/categorySettings";

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

interface Category {
  categoryId: BigInt;
  categoryName: string;
  color: string;
}

const Profile: React.FC = () => {
  const [titles, setTitles] = useState<Title[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [mainTitle, setMainTitle] = useState<Title | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // 서버에서 데이터 불러오기
    const fetchProfileInfo = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`);
        const data = await response.json();
        setTitles(data.titles);
        setUserInfo(data.userInfo);
        setCategories(data.categories);
        const mainTitleData = data.titles.find((title: Title) => title.titleId === data.userInfo.main_title) || null;
        setMainTitle(mainTitleData);
      } catch (error) {
        console.error('Error fetching titles', error);
      }
    };

    // fetchProfileInfo();

    // 테스트용 데이터 설정
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
    const testUserInfoData = {
      userEmail: "hourglass@hourglass.com",
      userName: "성기사이즈킹",
      main_title: BigInt(6),
    };
    const testCategoryData = [
      { categoryId: BigInt(1), categoryName: 'Spring', color: '#228B22' },
      { categoryId: BigInt(2), categoryName: 'MySQL', color: '#1E90FF' },
      { categoryId: BigInt(3), categoryName: '독서', color: '#8A2BE2' },
      { categoryId: BigInt(4), categoryName: '운동', color: '#FFD700' },
      { categoryId: BigInt(5), categoryName: '코딩', color: '#FF69B4' },
      { categoryId: BigInt(6), categoryName: '핀토스', color: '#FF4500' },
      { categoryId: BigInt(7), categoryName: '알고리즘', color: '#808080' },
    ];
    setTitles(testTitleData);
    setUserInfo(testUserInfoData);
    setCategories(testCategoryData);
    const mainTitleData = testTitleData.find(title => title.titleId === testUserInfoData.main_title) || null;
    setMainTitle(mainTitleData);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="lg:col-span-2 mb-4">
        <ProfileCard userInfo={userInfo} mainTitle={mainTitle} />
      </div>
      <div className="mb-4">
        <TitleList titles={titles} setUserInfo={setUserInfo} />
      </div>
      <div className="mb-4">
        <CategorySettings categories={categories} setCategories={setCategories} />
      </div>
    </div>
  );
};

export default Profile;
