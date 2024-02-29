"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { createBrowserClient } from "@/lib/pocketbase/create-browser-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { projectId } = useParams();
  const [formDataState, setFormDataState] = useState<any>(null);
  const pb = createBrowserClient();
  const route = useRouter();
  const [images, setImages] = useState<any>([]);

  const getImages = () => {
    // 나중에 페이지네이션 고려해서 1 ~ 50 한정
    pb.collection("images")
      .getList(1, 50, {
        filter: `project_id="${projectId}"`,
      })
      .then((list: any) => {
        setImages(list.items);
      });
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <main className="p-4 space-y-4 w-[1200px]">
      <Header title="PROJECT IMAGES" description="프로젝트 상세페이지입니다.">
        <section className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="px-6" size={"default"}>
                이미지 업로드
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>이미지 업로드</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <section className="flex gap-2">
                  <Label className="font-bold flex items-center w-[50px]">
                    이미지
                  </Label>
                  <Input
                    id="title"
                    onChange={(e: any) => {
                      const file = e.target.files[0];

                      if (!file) {
                        console.log("No file selected.");
                        setFormDataState(null);
                        return;
                      }

                      const formData = new FormData();
                      formData.append("image", file); // 'image'는 서버 측에서 파일을 식별하기 위한 키입니다.

                      setFormDataState(formData);
                    }}
                    type="file"
                  />
                </section>

                <section className="flex justify-end">
                  <Button
                    disabled={!formDataState?.get("image")}
                    onClick={async () => {
                      let formData = formDataState;
                      await formData.append("project_id", projectId);
                      await formData.append("json_label", null);

                      try {
                        // pb에 저장하기
                        await pb.collection("images").create(formData);
                      } catch {
                        // toast({ title: "업로드 실패" });
                      }

                      setFormDataState(null);
                    }}
                    type="button"
                  >
                    <DialogClose>완료</DialogClose>
                  </Button>
                </section>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            className="px-6"
            size={"default"}
            variant={"outline"}
            onClick={() => {
              // getProjects();
            }}
          >
            새로고침
          </Button>
        </section>
      </Header>
      <article>
        <div className="grid grid-cols-4 gap-4">
          {images.map((image: any) => {
            return (
              <Card
                onClick={() => {
                  route.push(`/project/${projectId}/${image.id}`);
                }}
              >
                <CardContent>
                  <img
                    src={`${process.env.NEXT_PUBLIC_POCKETBASE_API_URL}/api/files/${image.collectionId}/${image.id}/${image.image}`}
                  />
                  <p className="truncate">{image.image}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </article>
    </main>
  );
};

export default Page;
