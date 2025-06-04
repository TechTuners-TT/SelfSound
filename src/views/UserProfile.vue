// Add this to the script section of your UserProfile.vue - replace the fetchUserStats function

// Enhanced fetch functions with mobile authentication support
const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  // Get token from storage (mobile-first approach)
  const token = localStorage.getItem('authToken') || 
               sessionStorage.getItem('authToken') || 
               localStorage.getItem('auth_backup');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('📱 Using Authorization header for API call');
  } else {
    console.log('🍪 No token found, relying on cookies');
  }
  
  return headers;
};

// FIXED: Fetch user stats with proper authentication and endpoint
const fetchUserStats = async () => {
  try {
    if (!user.id) {
      console.warn("No user ID available for stats");
      return;
    }

    console.log("🔍 Fetching user stats for user:", user.id);
    
    // FIXED: Use the correct endpoint that matches your backend
    const response = await fetch(`${API_URL}/profile/${user.id}/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: "include", // Keep for cookie fallback
    });

    if (!response.ok) {
      console.error(`Stats API error: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch user stats: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ User stats loaded:", data);

    // Your API returns exactly these field names
    stats.posts = data.posts ?? 0;
    stats.listeners = data.listeners ?? 0;
    stats.listenedTo = data.listenedTo ?? 0;

    console.log("📊 Final stats:", {
      posts: stats.posts,
      listeners: stats.listeners,
      listenedTo: stats.listenedTo,
    });
  } catch (error) {
    console.error("❌ Error fetching user stats:", error);
    // Set default values on error but don't reset if we already have values
    if (stats.posts === 0 && stats.listeners === 0 && stats.listenedTo === 0) {
      stats.posts = 0;
      stats.listeners = 0;
      stats.listenedTo = 0;
    }
  }
};

// FIXED: Fetch posts with proper authentication
const fetchPosts = async (loadMore = false) => {
  if (!user.id) return;

  if (loadMore) {
    isLoadingMore.value = true;
  } else {
    isLoadingPosts.value = true;
    offset.value = 0;
  }

  postsError.value = "";

  try {
    const endpoint = `${API_URL}/posts/user/${user.id}?limit=${limit}&offset=${offset.value}`;
    console.log("Fetching posts from:", endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: "include", // Keep for cookie fallback
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const backendPosts: BackendPost[] = await response.json();
    console.log("Fetched backend posts:", backendPosts);

    const transformedPosts = backendPosts
      .map(transformBackendPost)
      .filter(Boolean) as FeedPost[];

    if (loadMore) {
      posts.value.push(...transformedPosts);
    } else {
      posts.value = transformedPosts;
    }

    hasMore.value = backendPosts.length === limit;
    offset.value += backendPosts.length;

    // Update posts count in stats
    if (!loadMore) {
      stats.posts = backendPosts.length;
    }
  } catch (err) {
    console.error("Error fetching posts:", err);
    postsError.value =
      err instanceof Error ? err.message : "Failed to load posts";

    if (!loadMore) {
      posts.value = [];
    }
  } finally {
    isLoadingPosts.value = false;
    isLoadingMore.value = false;
  }
};

// FIXED: Load user profile with proper authentication
const loadUserProfile = async () => {
  isLoading.value = true;

  try {
    console.log("🔍 Loading user profile...");
    
    const response = await fetch(`${API_URL}/profile/me/profile`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        "Cache-Control": "no-cache"
      },
      credentials: "include", // Keep for cookie fallback
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch profile: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ User profile loaded:", data);

    if (data && data.id) {
      // Update user reactive object with name truncation
      Object.assign(user, {
        id: data.id,
        name: truncateName(data.name || ""), // Apply name truncation here
        login: data.login || "",
        biography: data.description || "",
        avatarUrl: data.avatar_url || user.avatarUrl, // Keep default if no avatar
        tag: data.tag_id || null,
      });

      console.log("👤 User object updated:", user);

      // If the name was truncated, automatically update it on the backend
      if (data.name && data.name.length > 15) {
        console.log(
          "🔄 Name was too long, updating backend with truncated name...",
        );
        try {
          await fetch(`${API_URL}/profile/me`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            credentials: "include",
            body: JSON.stringify({
              name: user.name, // Send truncated name
            }),
          });
          console.log("✅ Backend updated with truncated name");
        } catch (error) {
          console.error(
            "❌ Failed to update backend with truncated name:",
            error,
          );
        }
      }

      // Load user stats and posts after profile is loaded
      // Make sure to wait for stats before loading posts
      await fetchUserStats();
      await fetchPosts();
    }
  } catch (err) {
    console.error("❌ Error loading user profile:", err);
  } finally {
    isLoading.value = false;
  }
};

// Add this debug function to test authentication
const testAuthentication = async () => {
  try {
    console.log("🔍 Testing authentication...");
    
    const response = await fetch(`${API_URL}/profile/debug/auth-info`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: "include",
    });

    const debugInfo = await response.json();
    console.log("🔍 Auth Debug Info:", debugInfo);
    
    return debugInfo;
  } catch (error) {
    console.error("❌ Auth test failed:", error);
    return null;
  }
};
