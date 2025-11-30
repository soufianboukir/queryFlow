# React Query Integration Guide

This guide explains how React Query (TanStack Query) has been integrated into the QueryFlow application and how to use it.

## Overview

React Query has been integrated to manage server state, providing:
- **Automatic caching** of API responses
- **Background refetching** for fresh data
- **Optimistic updates** support
- **Loading and error states** management
- **Automatic cache invalidation** on mutations

## Setup

### Provider Setup

The `QueryClientProvider` is set up in `app/layout.tsx` wrapping the entire application:

```tsx
import { QueryProvider } from "@/lib/query-client";

// In layout.tsx
<QueryProvider>
  <ThemeProvider>
    {children}
  </ThemeProvider>
</QueryProvider>
```

### QueryClient Configuration

The QueryClient is configured with sensible defaults in `lib/query-client.tsx`:
- **staleTime**: 60 seconds (data is considered fresh for 1 minute)
- **refetchOnWindowFocus**: false (prevents unnecessary refetches)
- **retry**: 1 (retries failed requests once)

## Available Hooks

### Authentication Hooks

#### `useCurrentUser()`

Fetches the currently authenticated user.

```tsx
import { useCurrentUser } from "@/hooks/use-auth";

function MyComponent() {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>Not authenticated</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

**Returns:**
- `data`: User object or `undefined`
- `isLoading`: Boolean indicating if query is in progress
- `error`: Error object if query failed
- `isError`: Boolean indicating if query has error
- `refetch`: Function to manually refetch the data

### Question/Answer Hooks

#### `useAskQuestion()`

Mutation hook to ask a question to the chatbot.

```tsx
import { useAskQuestion } from "@/hooks/use-ask";

function ChatComponent() {
  const askMutation = useAskQuestion();

  const handleAsk = () => {
    askMutation.mutate(
      {
        question: "What is React?",
        historyUrl: "optional-history-url", // optional
      },
      {
        onSuccess: (data) => {
          console.log("Response:", data.response);
          console.log("Similarity:", data.similarity);
          // Handle success (update UI, show notification, etc.)
        },
        onError: (error) => {
          console.error("Error:", error);
          // Handle error (show error message, etc.)
        },
      }
    );
  };

  return (
    <div>
      <button
        onClick={handleAsk}
        disabled={askMutation.isPending}
      >
        {askMutation.isPending ? "Asking..." : "Ask Question"}
      </button>
      {askMutation.isError && (
        <div>Error: {askMutation.error.message}</div>
      )}
    </div>
  );
}
```

**Returns:**
- `mutate`: Function to trigger the mutation
- `mutateAsync`: Async function version
- `isPending`: Boolean indicating if mutation is in progress
- `isError`: Boolean indicating if mutation has error
- `error`: Error object if mutation failed
- `data`: Response data after successful mutation

### History Hooks

#### `useHistories()`

Query hook to fetch all chat histories.

```tsx
import { useHistories } from "@/hooks/use-history";

function HistoriesList() {
  const { data, isLoading, error } = useHistories();

  if (isLoading) return <div>Loading histories...</div>;
  if (error) return <div>Error loading histories</div>;

  const histories = data?.histories || data || [];

  return (
    <ul>
      {histories.map((history) => (
        <li key={history._id}>{history.title}</li>
      ))}
    </ul>
  );
}
```

#### `useHistoryByUrl(historyUrl)`

Query hook to fetch a specific chat history by URL.

```tsx
import { useHistoryByUrl } from "@/hooks/use-history";

function ChatHistory({ url }: { url: string }) {
  const { data, isLoading } = useHistoryByUrl(url);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{data?.title}</h2>
      {data?.messages?.map((msg, idx) => (
        <div key={idx}>{msg.content}</div>
      ))}
    </div>
  );
}
```

**Note**: This hook is **disabled** (won't run) if `historyUrl` is `null` or `undefined`.

#### `useUpdateVisibility()`

Mutation hook to update history visibility (public/private).

```tsx
import { useUpdateVisibility } from "@/hooks/use-history";

function VisibilityToggle({ id }: { id: string }) {
  const updateMutation = useUpdateVisibility();

  const toggleVisibility = () => {
    updateMutation.mutate(
      { id, visibility: "public" },
      {
        onSuccess: () => {
          // Cache is automatically invalidated
          // Histories will refetch automatically
        },
      }
    );
  };

  return (
    <button
      onClick={toggleVisibility}
      disabled={updateMutation.isPending}
    >
      {updateMutation.isPending ? "Updating..." : "Make Public"}
    </button>
  );
}
```

#### `useUpdateTitle()`

Mutation hook to update history title.

```tsx
import { useUpdateTitle } from "@/hooks/use-history";

function TitleEditor({ id, currentTitle }: { id: string; currentTitle: string }) {
  const [title, setTitle] = useState(currentTitle);
  const updateMutation = useUpdateTitle();

  const handleSave = () => {
    updateMutation.mutate(
      { id, title },
      {
        onSuccess: (data) => {
          console.log("Updated title:", data.title);
        },
      }
    );
  };

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={handleSave}
        disabled={updateMutation.isPending}
      >
        Save
      </button>
    </div>
  );
}
```

#### `useDeleteHistory()`

Mutation hook to delete a history.

```tsx
import { useDeleteHistory } from "@/hooks/use-history";

function DeleteButton({ id }: { id: string }) {
  const deleteMutation = useDeleteHistory();

  const handleDelete = () => {
    if (confirm("Are you sure?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          // History list will automatically refresh
        },
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleteMutation.isPending}
    >
      {deleteMutation.isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
```

## Key Features

### Automatic Cache Invalidation

When mutations succeed, related queries are automatically invalidated and refetched:

```tsx
// After updating a history title
updateMutation.mutate({ id, title: "New Title" });
// → useHistories() automatically refetches
// → useHistoryByUrl() for that history automatically refetches
```

### Conditional Queries

Queries are automatically disabled/enabled based on conditions:

```tsx
// Only runs if token exists
const { data } = useCurrentUser(); // enabled: !!token

// Only runs if historyUrl is provided
const { data } = useHistoryByUrl(url); // enabled: !!url
```

### Loading States

React Query provides loading states out of the box:

```tsx
const { data, isLoading, isFetching } = useHistories();

// isLoading: true on initial load (no cached data)
// isFetching: true whenever data is being fetched (including refetches)
```

### Error Handling

Errors are automatically handled and can be accessed:

```tsx
const { data, error, isError } = useHistories();

if (isError) {
  console.error(error);
  // Show error UI
}
```

## Query Keys

Query keys are organized hierarchically for easy invalidation:

```tsx
// Auth queries
authKeys.user() // ["auth", "currentUser"]

// History queries
historyKeys.all() // ["history"]
historyKeys.list() // ["history", "list"]
historyKeys.detail(id) // ["history", "detail", id]

// Invalidate all history queries
queryClient.invalidateQueries({ queryKey: historyKeys.all() });

// Invalidate only list queries
queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
```

## Best Practices

### 1. Use Hooks in Components

Always use the provided hooks instead of calling services directly:

```tsx
// ✅ Good
const { data } = useHistories();

// ❌ Bad
const [data, setData] = useState([]);
useEffect(() => {
  getHistories(token).then(setData);
}, []);
```

### 2. Handle Loading and Error States

Always handle loading and error states:

```tsx
const { data, isLoading, isError, error } = useCurrentUser();

if (isLoading) return <Spinner />;
if (isError) return <Error message={error.message} />;
return <UserProfile user={data} />;
```

### 3. Use Mutations for Write Operations

Use mutation hooks for POST, PUT, DELETE operations:

```tsx
const deleteMutation = useDeleteHistory();

deleteMutation.mutate(id, {
  onSuccess: () => toast.success("Deleted!"),
  onError: () => toast.error("Failed!"),
});
```

### 4. Leverage Automatic Refetching

React Query automatically refetches data when:
- Component mounts
- Window regains focus (if enabled)
- Network reconnects (if enabled)
- Cache is invalidated

You don't need to manually trigger refetches after mutations!

## Migration Notes

The following components have been migrated from manual state management to React Query:

1. ✅ `app/page.tsx` - Uses `useAskQuestion()` and `useHistoryByUrl()`
2. ✅ `components/nav-user.tsx` - Uses `useCurrentUser()`
3. ✅ `components/nav-actions.tsx` - Uses `useCurrentUser()`
4. ✅ `components/histories.tsx` - Uses `useHistories()`
5. ✅ `components/delete-history.tsx` - Uses `useDeleteHistory()`
6. ✅ `components/rename-history.tsx` - Uses `useUpdateTitle()`
7. ✅ `components/change-visibility.tsx` - Uses `useUpdateVisibility()`

## Helper Functions

### `getToken()`

Utility function to get authentication token from cookies:

```tsx
import { getToken } from "@/hooks/use-auth";

const token = getToken(); // string | null
```

This is used internally by hooks but can also be used in components if needed.

## Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools) - Consider adding for debugging
- [Query Key Factory Pattern](https://tkdodo.eu/blog/effective-react-query-keys)

