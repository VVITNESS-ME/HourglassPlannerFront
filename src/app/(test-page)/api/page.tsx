'use client'
import { useState, useEffect } from "react";
export default function TestPage() {

    async function test() {
        try {
            const response = await fetch('https://localhost:8080/api/hello', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.text(); // 텍스트 형식의 응답을 받음
            console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

  useEffect (() => {

  },[])


  return (
    <div className="flex">
        <button onClick={test}>Test</button>
    </div>
    );
}