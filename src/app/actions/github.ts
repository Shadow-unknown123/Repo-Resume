export async function getUser(username: string) {
  if (!username) return null;
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error(`Github API error: ${res.status}`);
    const user = await res.json();

    const Res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
    );
    if (!Res.ok) throw new Error(`Github API error: ${res.status}`);
    const repos = await Res.json();

    return { user, repos };
  } catch (err: any) {
    return "error";
  }
}
