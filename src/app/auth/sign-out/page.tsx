'use client';

import { signOutAction } from './actions';

export default function SignOutPage() {
  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center p-4">
      <h1 className="text-center text-2xl font-bold">Signing out...</h1>
      <button
        onClick={async () => {
          await signOutAction();
        }}
        className="rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400"
      >
        Sign out
      </button>
    </div>
  );
}
