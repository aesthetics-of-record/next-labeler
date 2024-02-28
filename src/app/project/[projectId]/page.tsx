"use client";

import Header from "@/components/header";
import { useParams } from "next/navigation";

const Page = () => {
  const { projectId } = useParams();

  return (
    <main className="p-4 space-y-4 w-[1200px]">
      <Header title="PROJECT IMAGES" description="프로젝트 상세페이지입니다.">
        a
      </Header>
      <div>{projectId}</div>
    </main>
  );
};

export default Page;
