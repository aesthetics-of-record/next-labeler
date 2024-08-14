"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const [projects, setProjects] = useState<any[]>([]); // 처음은 빈리스트
  const route = useRouter();
  const [file, setFile] = useState(null);
  const { toast } = useToast();

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]); // 파일을 상태로 설정
  };

  // 파일 목록 가져오기
  const getFiles = () => {
    axios.get("/api/file").then((res) => {
      setProjects(res.data);
    });
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // 파일을 FormData에 추가

    try {
      const response = await fetch("/api/file", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("파일 업로드 성공:", result);

        getFiles();
      } else {
        console.error("파일 업로드 실패:", response.statusText);
      }
    } catch (error) {
      console.error("파일 업로드 중 에러 발생:", error);
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <main className="p-4 space-y-4 w-[1200px]">
      <Header
        title="INFERENCE FILES"
        description="추론할 파일을 업로드 할 수 있습니다."
      >
        <section className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="px-6">추론할 파일 업로드</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>추론할 파일 업로드</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <section className="flex gap-2">
                  <Label className="font-bold flex items-center w-[80px]">
                    파일(zip)
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".zip,.rar,.7z"
                    onChange={handleFileChange} // 파일 변경 시 상태 업데이트
                  />
                </section>
                <section className="flex justify-end">
                  <Button
                    disabled={!file}
                    onClick={async () => {
                      toast({
                        title: "AI 추론 진행 중 입니다...",
                        description:
                          "잠시만 기다려 주세요. 최대 1분이 소요됩니다..",
                        duration: 20000
                      });
                      await handleSubmit();
                      toast({
                        title: "추론 및 업로드 성공 !",
                        description: "파일을 다운 받으실 수 있습니다.",
                        duration: 10000
                      });
                    }}
                    type="button"
                  >
                    <DialogClose>업로드</DialogClose>
                  </Button>
                </section>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            className="px-6"
            variant={"outline"}
            onClick={() => {
              getFiles();
            }}
          >
            새로고침
          </Button>
        </section>
      </Header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {projects.map((project: any) => {
          return (
            <Card key={project._id}>
              <CardContent>
                <CardHeader>
                  <CardTitle>{project?.origin_name}</CardTitle>
                </CardHeader>
                <CardFooter>
                <div>
                  <a href={`/api/download/${project?._id}`} download>
                    <Button>다운로드</Button>
                  </a>
                </div>
                </CardFooter>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
};

export default Home;
