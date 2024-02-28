'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBrowserClient } from '@/lib/pocketbase/create-browser-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Home = () => {
  const [projects, setProjects] = useState<any[]>([]); // 처음은 빈리스트
  const route = useRouter();
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
  }>({ title: '', description: '' });
  const pb = createBrowserClient();

  // 프로젝트 목록 가져오기
  const getProjects = () => {
    pb.collection('projects')
      .getFullList({ sort: 'created' })
      .then((list: any) => {
        setProjects(list);
      });
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <main className="p-4 space-y-4 w-[1200px]">
      <Header
        title="PROJECT"
        description="새로운 프로젝트를 추가할 수 있습니다."
      >
        <section className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="px-6"
                size={'default'}
              >
                프로젝트추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>프로젝트 추가</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <section className="flex gap-2">
                  <Label className="font-bold flex items-center w-[50px]">
                    제목
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </section>
                <section className="flex gap-2">
                  <Label className="font-bold flex items-center w-[50px]">
                    내용
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </section>
                <section className="flex justify-end">
                  <Button
                    disabled={!(formData.title && formData.description)}
                    onClick={async () => {
                      // pb에 저장하기
                      await pb.collection('projects').create({
                        title: formData.title,
                        description: formData.description,
                      });

                      getProjects();
                    }}
                  >
                    <DialogClose>완료</DialogClose>
                  </Button>
                </section>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            className="px-6"
            size={'default'}
            variant={'outline'}
            onClick={() => {
              getProjects();
            }}
          >
            새로고침
          </Button>
        </section>
      </Header>
      <div className="grid grid-cols-4 gap-4">
        {projects.map((project: any) => {
          return (
            <Card
              key={project.id}
              onClick={() => {
                route.push('/project/' + project?.id); // 프로젝트 디테일로 이동
              }}
            >
              <CardContent>
                <div>{project?.title}</div>
                <div>{project?.description}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
};

export default Home;
