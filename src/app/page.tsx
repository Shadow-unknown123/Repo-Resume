"use client";

import { getUser } from "./actions/github";

import * as htmlToImage from "html-to-image";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { ExternalLink, GitFork, Image, Star } from "lucide-react";

interface gitHubUser {
  id: number;
  name: string;
  avatar_url: string;
  html_url: string;
  type: string;
  email: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  updated_at: string;
}

interface userRepos {
  id: number;
  name: string;
  private: boolean;
  html_url: string;
  description: string;
  forks_count: number;
  updated_at: string;
  stargazers_count: number;
  language: string | null;
}

function Home() {
  const [input, setInput] = useState("");
  const [user, setUser] = useState<gitHubUser>();
  const [repos, setRepos] = useState<userRepos[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGen, setIsGen] = useState(false);

  async function getData() {
    setLoading(true);
    setError("");
    setUser(undefined);
    setRepos([]);

    const data = await getUser(input);
    setLoading(false);
    if (!data) {
      setError("Please enter username!");
      return;
    } else if (data == "error") setError("User not found");

    if (data !== "error") {
      let { user, repos } = data;
      setUser(user);
      setRepos(repos);
    }

    console.log(repos);
  }

  async function downlaodResume() {
    const node = document.getElementById("resume-div");
    if (!node) return;

    try {
      //downloading image
      const dataUrl: string = await htmlToImage.toPng(node);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "Resume.png";
      link.click();

      //preview in new tab
      const newWindow = window.open();
      if (newWindow) {
        const img = newWindow.document.createElement("img");
        img.src = dataUrl;
        img.style.maxWidth = "90%";
        img.style.maxHeight = "90%";
        img.style.display = "block";
        img.style.margin = "0 auto";
        newWindow.document.title = "Resume preview";
        newWindow.document.body.style.background = "#111";
        newWindow.document.body.style.margin = "0";
        newWindow.document.body.style.display = "flex";
        newWindow.document.body.style.justifyContent = "center";
        newWindow.document.body.style.alignItems = "center";
        newWindow.document.body.appendChild(img);
      }
    } catch (err) {
      console.error("Error generating resume image:", err);
    }
  }

  return (
    <>
      <Header />
      <div className="font-mono flex justify-center items-center mt-10 ">
        <p className="max-w-[50%] text-center text-foreground/65">
          Transform your GitHub repositories into a beautiful, downloadable
          portfolio image. Perfect for showcasing your projects on social media,
          resumes, or presentations.
        </p>
      </div>
      <div className="flex justify-center items-center mt-10">
        <div className="  flex w-full max-w-md gap-2 mb-10 px-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Button onClick={() => getData()}>Generate</Button>
        </div>
      </div>

      {error && (
        <div className="flex justify-center items-center ">
          <Alert variant="destructive" className="max-w-72">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {loading && (
        <div>
          <div className="flex flex-col gap-3 justify-center items-center">
            <Skeleton className="rounded-full w-20 h-20" />
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-80 h-3" />
          </div>
          <div className="flex justify-center items-center mt-10 flex-wrap gap-5">
            <Skeleton className="w-96 h-60 " />
            <Skeleton className="w-96 h-60 " />
            <Skeleton className="w-96 h-60 " />
            <Skeleton className="w-96 h-60 " />
            <Skeleton className="w-96 h-60 " />
            <Skeleton className="w-96 h-60 " />
            <Skeleton className="w-96 h-60 " />
            <Skeleton className="w-96 h-60 " />
          </div>
        </div>
      )}

      {user && (
        <div className="flex flex-col gap-3 justify-center items-center">
          <img
            src={user?.avatar_url}
            alt="User Avatar"
            className="rounded-full w-20 h-20"
          />
          <h1>{user?.name}</h1>
          <h2>{user?.bio}</h2>
          <div className="flex justify-between items-center w-80 text-sm">
            <h3>{user?.public_repos} repositories</h3>
            <h3>{user?.followers} followers</h3>
            <h3>{user?.following} following</h3>
          </div>
        </div>
      )}
      {repos.length > 0 && (
        <div className="flex justify-center items-center my-10 flex-wrap gap-5">
          {repos.map((repo) => (
            <Card
              key={repo.id}
              className="w-96 min-h-60 group hover:shadow-lg flex justify-between"
            >
              <CardHeader>
                <CardTitle className="text-lg">{repo?.name}</CardTitle>
                <CardDescription className="mt-3 ">
                  {repo?.description}
                </CardDescription>
                <CardAction>
                  <Button
                    variant="ghost"
                    className="lg:opacity-0 group-hover:opacity-100 transition-opacity"
                    size="sm"
                  >
                    <a href={repo.html_url} target="_blank">
                      <ExternalLink />
                    </a>
                  </Button>
                </CardAction>
              </CardHeader>
              <div>
                <CardContent>
                  <div className="flex justify-between">
                    <Badge variant="secondary">{repo?.language}</Badge>

                    <div className="text-sm text-muted-foreground flex gap-2">
                      <h3 className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {repo?.stargazers_count}
                      </h3>
                      <h3 className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {repo?.forks_count}
                      </h3>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="mt-4">
                  <p className="text-muted-foreground text-xs">
                    {repo &&
                      new Date(repo.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                  </p>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Portfolio Generator */}
      {user && (
        <div className="flex items-center justify-center px-6 mb-10 ">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image size={15} /> Generate Repo Portfolio
              </CardTitle>
              <CardDescription>
                Create a beautiful portfolio image showcasing your top
                repositories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={() => setIsGen(true)}>
                  Generate Portfolio
                </Button>
                <Button onClick={() => downlaodResume()} variant="outline">
                  Download PNG
                </Button>
              </div>
              {isGen && (
                <div className="mt-5">
                  <Card className="flex justify-center items-center overflow-scroll no-scrollbar">
                    <div
                      id="resume-div"
                      className="w-[794px] h-[1000px]  shadow-2xl  ps-7 pt-10 relative bg-background"
                    >
                      <div className=" flex items-center gap-x-5">
                        <img
                          src={user?.avatar_url}
                          alt="User Avatar"
                          className="rounded-full w-20 h-20"
                        />
                        <div>
                          <h1 className="font-semibold text-lg">
                            {user?.name}
                          </h1>
                          <h2 className="text-foreground/75 text-sm pt-2">
                            {user?.bio}
                          </h2>
                        </div>
                      </div>
                      <div className="flex justify-between items-center w-80 text-sm text-foreground/85 mt-7 ms-3">
                        <h3>{user?.public_repos} repositories</h3>
                        <h3>{user?.followers} followers</h3>
                        <h3>{user?.following} following</h3>
                      </div>
                      <h1 className="mt-10 ms-3 text-2xl mb-7">
                        Featured Repositories
                      </h1>
                      <div className="flex flex-wrap w-[700px] gap-5 ">
                        {repos.slice(0, 6).map((repo) => (
                          <Card
                            key={repo.id}
                            className="w-80 max-h-52 group hover:shadow-lg rounded-none flex justify-between"
                          >
                            <CardHeader>
                              <CardTitle>{repo?.name}</CardTitle>
                              <CardDescription className="mt-3 text-xs  ">
                                {repo?.description}
                              </CardDescription>
                              <CardAction>
                                <Button
                                  variant="ghost"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  size="sm"
                                >
                                  <a href={repo.html_url} target="_blank">
                                    <ExternalLink />
                                  </a>
                                </Button>
                              </CardAction>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-between">
                                <p className="rounded-3xl   font-semibold text-xs py-1 text-center">
                                  {repo?.language}
                                </p>
                                <div className="text-sm text-muted-foreground flex gap-2">
                                  <h3 className="flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    {repo?.stargazers_count}
                                  </h3>
                                  <h3 className="flex items-center gap-1">
                                    <GitFork className="w-3 h-3" />
                                    {repo?.forks_count}
                                  </h3>
                                </div>
                              </div>
                            </CardContent>
                            {/* <CardFooter>
                            <p className="text-muted-foreground text-xs">
                              {repo &&
                                new Date(repo.updated_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                            </p>
                          </CardFooter> */}
                          </Card>
                        ))}
                      </div>
                      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-foreground/70">
                        {user?.html_url}
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default Home;
