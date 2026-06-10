import { useTheme } from "next-themes";
export default function Toggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    >
      Switch to {resolvedTheme === "light" ? "dark" : "light"} mode
    </button>
  );
}
