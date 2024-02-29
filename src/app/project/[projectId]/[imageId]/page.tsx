"use client";

import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { BoxIcon, HandIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ButtonPrimary1 from "@/components/custom/button-primary-1";
import { createBrowserClient } from "@/lib/pocketbase/create-browser-client";
import { useParams } from "next/navigation";

const ImageLabeler = () => {
  const image = new Image();
  const { imageId } = useParams();
  const pb = createBrowserClient();
  const canvasRef = useRef<any>(null);
  const imageRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [bboxList, setBboxList] = useState<any[]>([]);
  const [tool, setTool] = useState(0);
  const [isResize, setIsResize] = useState<{
    direction: null | string;
    index: number;
    oppositeX: number;
    oppositeY: number;
  }>({
    direction: null,
    index: -1,
    oppositeX: -1,
    oppositeY: -1,
  });
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    pb.collection("images")
      .getOne(imageId)
      .then((image: any) => {
        setImageUrl(
          `${process.env.NEXT_PUBLIC_POCKETBASE_API_URL}/api/files/${image.collectionId}/${image.id}/${image.image}`
        );
        if (image.json_label === null || image.json_label.length === 0) {
          setBboxList([]);
        } else {
          setBboxList(image.json_label);
        }
      });
  }, []);

  useEffect(() => {
    image.src = imageUrl;
    image.onload = () => {
      const canvas: any = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = image.width;
      canvas.height = image.height;

      // 이미지를 캔버스에 그립니다.
      ctx.drawImage(image, 0, 0);
      imageRef.current = image;
    };
  }, [imageUrl]);

  const handleMouseDown = (e: any) => {
    if (tool == 0) {
    }

    if (tool != 1) return;

    const rect = canvasRef.current.getBoundingClientRect();
    setStartPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: any) => {
    if (tool === 0 && isResize.direction) {
      const rect = canvasRef.current.getBoundingClientRect();

      if (isResize.direction === "nw") {
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const width = Math.abs(currentX - isResize.oppositeX);
        const height = Math.abs(currentY - isResize.oppositeY);
        const x0 = Math.min(currentX, isResize.oppositeX);
        const y0 = Math.min(currentY, isResize.oppositeY);

        let copy = [...bboxList];
        copy[isResize.index].x0 = x0;
        copy[isResize.index].y0 = y0;
        copy[isResize.index].width = width;
        copy[isResize.index].height = height;

        setBboxList(copy);
      }
      if (isResize.direction === "ne") {
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const width = Math.abs(currentX - isResize.oppositeX);
        const height = Math.abs(currentY - isResize.oppositeY);
        const x0 = Math.min(currentX, isResize.oppositeX);
        const y0 = Math.min(currentY, isResize.oppositeY);

        let copy = [...bboxList];
        copy[isResize.index].x0 = x0;
        copy[isResize.index].y0 = y0;
        copy[isResize.index].width = width;
        copy[isResize.index].height = height;

        setBboxList(copy);
      }
      if (isResize.direction === "se") {
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const width = Math.abs(currentX - isResize.oppositeX);
        const height = Math.abs(currentY - isResize.oppositeY);
        const x0 = Math.min(currentX, isResize.oppositeX);
        const y0 = Math.min(currentY, isResize.oppositeY);

        let copy = [...bboxList];
        copy[isResize.index].x0 = x0;
        copy[isResize.index].y0 = y0;
        copy[isResize.index].width = width;
        copy[isResize.index].height = height;

        setBboxList(copy);
      }
      if (isResize.direction === "sw") {
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const width = Math.abs(currentX - isResize.oppositeX);
        const height = Math.abs(currentY - isResize.oppositeY);
        const x0 = Math.min(currentX, isResize.oppositeX);
        const y0 = Math.min(currentY, isResize.oppositeY);

        let copy = [...bboxList];
        copy[isResize.index].x0 = x0;
        copy[isResize.index].y0 = y0;
        copy[isResize.index].width = width;
        copy[isResize.index].height = height;

        setBboxList(copy);
      }
      if (isResize.direction === "center") {
        const bbox = bboxList[isResize.index];

        const currentX0 = e.clientX - rect.left - bbox.width / 2;
        const currentY0 = e.clientY - rect.top - bbox.height / 2;

        const oppositeX = bbox.x0 + bbox.width;
        const oppositeY = bbox.y0 + bbox.height;

        const copy = [...bboxList];

        copy[isResize.index].x0 = currentX0;
        copy[isResize.index].y0 = currentY0;
        copy[isResize.index].width = bbox.width;
        copy[isResize.index].height = bbox.height;

        setBboxList(copy);
      }
    }

    if (!isDrawing) return;

    const ctx = canvasRef.current.getContext("2d");

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(imageRef.current, 0, 0);

    ctx.beginPath();

    ctx.setLineDash([10, 15]);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.rect(
      startPoint.x,
      startPoint.y,
      currentX - startPoint.x,
      currentY - startPoint.y
    );

    ctx.stroke();

    // 점선 설정을 해제합니다.
    ctx.setLineDash([]);
  };

  const handleMouseUp = (e: any) => {
    if (isResize.direction) {
      setIsResize({
        direction: null,
        index: -1,
        oppositeX: -1,
        oppositeY: -1,
      });

      if (isResize.direction === "center") {
        const rect = canvasRef.current.getBoundingClientRect();

        const bbox = bboxList[isResize.index];

        const currentX0 = e.clientX - rect.left - bbox.width / 2;
        const currentY0 = e.clientY - rect.top - bbox.height / 2;

        const oppositeX = bbox.x0 + bbox.width;
        const oppositeY = bbox.y0 + bbox.height;

        console.log(rect.width, oppositeX);
        console.log(rect.height, oppositeY);

        console.log(rect.width - bbox.width);

        const copy = [...bboxList];

        copy[isResize.index].x0 = currentX0;
        copy[isResize.index].y0 = currentY0;
        copy[isResize.index].width = bbox.width;
        copy[isResize.index].height = bbox.height;

        if (currentX0 < 0) {
          copy[isResize.index].x0 = 0;
        }
        if (currentY0 < 0) {
          copy[isResize.index].y0 = 0;
        }
        if (oppositeX >= rect.width) {
          copy[isResize.index].x0 = rect.width - bbox.width;
        }
        if (oppositeY >= rect.height) {
          copy[isResize.index].y0 = rect.height - bbox.height;
        }

        setBboxList(copy);
      }
      return;
    }

    if (tool != 1) return;

    const rect = canvasRef.current.getBoundingClientRect();

    // TODO : 어떤 방향/사이즈든 일정한 스케일링(0~1) 좌표 계산 식
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    let x0 = Math.min(currentX, startPoint.x);
    let y0 = Math.min(currentY, startPoint.y);

    let width = Math.abs(currentX - startPoint.x);
    let height = Math.abs(currentY - startPoint.y);

    // 화면 밖일 경우 좌표 보정
    if (currentX <= 0) {
      x0 = 0;
      width = startPoint.x;
    }
    if (currentY <= 0) {
      y0 = 0;
      height = startPoint.y;
    }
    if (currentX >= rect.width) {
      width = rect.width - startPoint.x;
    }
    if (currentY >= rect.height) {
      height = rect.height - startPoint.y;
    }

    setIsDrawing(false);
    // 여기서 바운딩 박스 데이터를 저장하거나 처리할 수 있습니다.

    if (Math.abs(width) < 5 || Math.abs(height) < 5) {
      // 너무 작으면 종료
      setBboxList([...bboxList]);
      return;
    }

    const bbox = {
      class: 0,
      label: "bread",
      x0: x0,
      y0: y0,
      width: width,
      height: height,
      active: false,
      color: "#22c55e55",
    };
    // console.log(bbox);

    const ctx = canvasRef.current.getContext("2d");

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(imageRef.current, 0, 0);

    setBboxList([...bboxList, bbox]);
  };

  return (
    <>
      <div className="flex h-screen">
        <menu className="overflow-auto scrollbar">
          <header className="flex gap-2 items-center justify-center border-b h-12">
            라벨링
            <Button
              variant={"outline"}
              onClick={async () => {
                try {
                  await pb.collection("images").update(imageId as string, {
                    json_label: bboxList,
                  });
                  console.log("저장 완료");
                } catch {
                  console.log("저장 실패");

                  return;
                }
              }}
            >
              저장
            </Button>
          </header>
          <ul className="bg-neutral w-56">
            {bboxList.map((bbox, i) => {
              return (
                <li
                  key={i}
                  onClick={() => {
                    if (bbox.active) {
                      let copy = [...bboxList];
                      copy[i].active = false;
                      setBboxList(copy);
                      console.log(copy);
                    } else {
                      let copy = [...bboxList];
                      for (let j = 0; j < copy.length; j++) {
                        copy[j].active = false;
                      }
                      copy[i].active = true;
                      setBboxList(copy);
                      console.log(copy);
                    }
                  }}
                  className={cn("px-3 py-1", bbox?.active && "bg-primary")}
                >
                  {bbox?.label}
                </li>
              );
            })}
          </ul>
        </menu>

        <div className="h-screen">
          <header>
            <div className="">
              <div className="flex-1">
                {/* <a className="btn btn-ghost text-xl">NES-Labeling</a> */}
              </div>
              <div className="flex-none">
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className={twMerge(
                    "",
                    tool == 0 && "hover:bg-primary bg-primary"
                  )}
                  onClick={() => {
                    setTool(0);
                  }}
                >
                  <HandIcon />
                </Button>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className={twMerge(
                    "",
                    tool == 1 && "hover:bg-primary bg-primary"
                  )}
                  onClick={() => {
                    setTool(1);

                    console.log(bboxList);

                    if (bboxList === null || bboxList?.length === 0) {
                      return;
                    }

                    let copy = [...bboxList];
                    for (let j = 0; j < copy.length; j++) {
                      copy[j].active = false;
                    }

                    setBboxList(copy);
                  }}
                >
                  <BoxIcon />
                </Button>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className={twMerge(
                    "",
                    tool == 2 && "hover:bg-primary bg-primary"
                  )}
                  onClick={() => {
                    setTool(2);
                  }}
                >
                  {/* <SlMenu /> */}menu
                </Button>
              </div>
            </div>
          </header>

          <div
            className="relative overflow-auto max-w-[1000px] min-w-[500px] h-[calc(100vh-100px)] scrollbar bg-slate-800"
            onMouseUp={handleMouseUp}
          >
            <canvas
              className={twMerge("cursor-default m-[100px]")}
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}

              // onMouseLeave={handleMouseLeave}
            />

            {bboxList.map((bbox, index) => {
              //////////
              // bbox //
              //////////
              return (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    left: `${bbox?.x0 + 100}px`,
                    top: `${bbox?.y0 + 100}px`,
                    width: `${bbox?.width}px`,
                    height: `${bbox?.height}px`,
                    border: "2px solid #22c55e",
                    backgroundColor: bbox?.active && bbox?.color,
                  }}
                  className={cn(
                    "",
                    tool === 0 && "cursor-pointer",
                    (tool === 1 || isResize.direction) && "pointer-events-none",
                    bbox?.active === true &&
                      "border-2 border-dashed cursor-default resize z-20"
                  )}
                  onClick={() => {
                    let copy = [...bboxList];
                    for (let j = 0; j < copy.length; j++) {
                      copy[j].active = false;
                    }
                    copy[index].active = true;
                    setBboxList(copy);
                  }}
                >
                  {bbox?.active === true ? (
                    <>
                      <div
                        className="rounded-full w-4 h-4 border-2 absolute -left-2 -top-2 cursor-nw-resize"
                        onMouseDown={() => {
                          const oppositeX = bbox?.x0 + bbox?.width;
                          const oppositeY = bbox?.y0 + bbox?.height;

                          setIsResize({
                            direction: "nw",
                            index: index,
                            oppositeX: oppositeX,
                            oppositeY: oppositeY,
                          });
                        }}
                      />
                      <div
                        className="rounded-full w-4 h-4 border-2 absolute -right-2 -top-2 cursor-ne-resize"
                        onMouseDown={() => {
                          const oppositeX = bbox?.x0;
                          const oppositeY = bbox?.y0 + bbox?.height;

                          setIsResize({
                            direction: "ne",
                            index: index,
                            oppositeX: oppositeX,
                            oppositeY: oppositeY,
                          });
                        }}
                      />
                      <div
                        className="rounded-full w-4 h-4 border-2 absolute -right-2 -bottom-2 cursor-se-resize"
                        onMouseDown={() => {
                          const oppositeX = bbox?.x0;
                          const oppositeY = bbox?.y0;

                          setIsResize({
                            direction: "se",
                            index: index,
                            oppositeX: oppositeX,
                            oppositeY: oppositeY,
                          });
                        }}
                      />
                      <div
                        className="rounded-full w-4 h-4 border-2 absolute -left-2 -bottom-2 cursor-sw-resize"
                        onMouseDown={() => {
                          const oppositeX = bbox?.x0 + bbox?.width;
                          const oppositeY = bbox?.y0;

                          setIsResize({
                            direction: "sw",
                            index: index,
                            oppositeX: oppositeX,
                            oppositeY: oppositeY,
                          });
                        }}
                      />
                      <div
                        className="rounded-full w-4 h-4 border-2 absolute left-[calc(50%-8px)] top-[calc(50%-8px)] cursor-move"
                        onMouseDown={() => {
                          setIsResize({
                            direction: "center",
                            index: index,
                            oppositeX: -1,
                            oppositeY: -1,
                          });
                        }}
                      />
                      <div
                        className="rounded-full w-4 h-4 border-2 absolute border-red-500 left-[calc(50%-8px)] -top-8 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newArray = [
                            ...bboxList.slice(0, index),
                            ...bboxList.slice(index + 1),
                          ];
                          console.log(newArray);

                          setBboxList([...newArray]);
                        }}
                      />
                    </>
                  ) : null}
                  {bbox?.active && (
                    <menu className={cn("absolute -bottom-[236px]")}>
                      <Card className="h-[220px] w-[250px] opacity-100 rounded-sm">
                        <CardHeader>
                          <CardTitle className="font-black text-xl">
                            라벨 설정
                          </CardTitle>
                        </CardHeader>
                        <form
                          onSubmit={(e: any) => {
                            e.preventDefault();

                            const copy = [...bboxList];
                            copy[index].active = false;

                            copy[index].label = e.target.label?.value;

                            setBboxList(copy);
                          }}
                        >
                          <CardContent className="flex gap-4 items-center">
                            <Input defaultValue={bbox?.label} id="label" />
                          </CardContent>
                          <CardFooter className="grid grid-cols-2 gap-4">
                            <ButtonPrimary1 type="submit">확인</ButtonPrimary1>
                            <Button
                              variant={"ghost"}
                              onClick={(e) => {
                                e.stopPropagation();
                                const copy = [...bboxList];
                                copy[index].active = false;

                                setBboxList(copy);
                              }}
                              type="button"
                            >
                              취소
                            </Button>
                          </CardFooter>
                        </form>
                      </Card>
                    </menu>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageLabeler;
