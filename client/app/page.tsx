
export default function Home() {
  return (
    <div className="flex min-h-screen items-center w-[100%] mx-auto justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col gap-4 w-[50%] text-center">
        <h1 className="text-3xl font-semibold">Hi, what's in agenda today?</h1>
        <div>
          <textarea placeholder="ask anything..." rows={4} className="py-3 px-4 resize-none rounded-xl border border-[1.2] border-white/40 w-full outline-none">
          </textarea>
        </div>
      </div>
    </div>
  );
}
