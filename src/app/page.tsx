"use client";

import { getUser } from "./actions/github";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { ExternalLink, GitFork, Star } from "lucide-react";

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
        <div className="flex justify-center items-center mt-10 flex-wrap gap-5">
          {repos.map((repo) => (
            <Card key={repo.id} className="w-96 min-h-60 group hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">{repo?.name}</CardTitle>
                <CardDescription className="mt-3 ">
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
                  <p className="rounded-3xl bg-foreground/30 px-3 font-semibold text-xs py-1 text-center">
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
              <CardFooter>
                <p className="text-muted-foreground text-xs">
                  {repo &&
                    new Date(repo.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

export default Home;
