//@flow

export default function authenticate(username: string, password: string) {
  if (username === "test1" && password === "pass1") return true;
  return false;
}
