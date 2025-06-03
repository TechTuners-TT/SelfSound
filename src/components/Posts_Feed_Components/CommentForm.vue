<template>
  <div class="w-full bg-white/10 rounded-[5px] pl-4 pt-4 pb-5 relative">
    <!-- Replace input with content-editable div -->
    <div
      ref="commentInputRef"
      contenteditable="true"
      @input="onInput"
      @keydown="onKeyDown"
      @paste="onPaste"
      class="w-full text-white text-sm outline-none bg-transparent min-h-[20px] max-h-[120px] overflow-y-auto"
      data-placeholder="What's on your mind?"
      :class="{ 'pointer-events-none': disabled }"
    ></div>

    <!-- Mention autocomplete dropdown -->
    <div
      v-if="showMentionDropdown && mentionSuggestions.length > 0"
      ref="dropdownRef"
      class="absolute z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto pointer-events-auto"
      :style="dropdownStyle"
      @mousedown.prevent
    >
      <div
        v-for="(user, index) in mentionSuggestions"
        :key="user.id"
        @mousedown.prevent="selectMention(user)"
        class="flex items-center gap-2 p-2 hover:bg-gray-700 cursor-pointer transition-colors"
        :class="{ 'bg-gray-700': index === selectedSuggestionIndex }"
      >
        <img
          :src="user.avatar_url || '/default-avatar.png'"
          :alt="user.name"
          class="w-6 h-6 rounded-full object-cover"
          @error="handleAvatarError"
        />
        <div class="flex flex-col">
          <span class="text-white text-sm font-medium">{{ user.name }}</span>
          <span class="text-gray-400 text-xs">@{{ user.login }}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="flex justify-end mt-[15px]">
    <button
      @click="submitComment"
      :disabled="disabled || !hasContent"
      class="px-2.5 py-1 text-lg font-bold bg-[#6D01D0]/20 text-[#6D01D0] rounded-[5px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
    >
      {{ disabled ? "Publishing..." : "Publish" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onUnmounted } from "vue";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  login: string;
  name: string;
  avatar_url: string;
}

interface Props {
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  (e: "submit", commentText: string): void;
}>();

// Refs
const commentInputRef = ref<HTMLDivElement>();
const dropdownRef = ref<HTMLElement>();

// State
const hasContent = ref(false);

// Mention autocomplete state
const showMentionDropdown = ref(false);
const mentionSuggestions = ref<User[]>([]);
const selectedSuggestionIndex = ref(0);
const currentMentionQuery = ref("");
const mentionStartPos = ref(0);
const mentionEndPos = ref(0);

// Dropdown positioning
const dropdownStyle = ref({});

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// Cleanup
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});

// Process mentions and make them purple (only for completed mentions)
const processMentions = (element: HTMLDivElement) => {
  // Get current cursor position
  const selection = window.getSelection();
  let cursorPos = -1;

  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
    );

    let currentPos = 0;
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node === range.startContainer) {
        cursorPos = currentPos + range.startOffset;
        break;
      }
      currentPos += (node as Text).textContent?.length || 0;
    }
  }

  const textContent = element.textContent || "";

  // Find mentions that need styling
  const mentionRegex = /@([a-zA-Z0-9_-]{3,})(?=\s|$)/g;
  let match;
  const mentionsToStyle: Array<{
    match: string;
    username: string;
    start: number;
    end: number;
  }> = [];

  while ((match = mentionRegex.exec(textContent)) !== null) {
    const start = match.index;
    const end = match.index + match[0].length;

    // Don't style if cursor is within this mention (currently being typed)
    if (cursorPos < start || cursorPos > end) {
      mentionsToStyle.push({
        match: match[0],
        username: match[1],
        start,
        end,
      });
    }
  }

  // Check if any mentions need styling
  let needsUpdate = false;
  for (const mention of mentionsToStyle) {
    // Check if this mention is already styled
    const existingSpan = element.querySelector(`span[data-username="${mention.username}"]`);
    if (!existingSpan) {
      needsUpdate = true;
      break;
    }
  }

  if (needsUpdate && mentionsToStyle.length > 0) {
    // Save cursor position before DOM manipulation
    let savedCursorPos = cursorPos;
    
    // Process mentions using DOM manipulation instead of innerHTML
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
    );

    const textNodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    // Process text nodes in reverse order to maintain positions
    for (let i = textNodes.length - 1; i >= 0; i--) {
      const textNode = textNodes[i];
      const text = textNode.textContent || "";
      
      // Find mentions in this text node
      const localMentionRegex = /@([a-zA-Z0-9_-]{3,})(?=\s|$)/g;
      let localMatch;
      const fragments: Array<{
        text: string;
        isMention: boolean;
        username?: string;
      }> = [];
      
      let lastIndex = 0;
      
      while ((localMatch = localMentionRegex.exec(text)) !== null) {
        const mentionStart = localMatch.index;
        const mentionEnd = localMatch.index + localMatch[0].length;
        
        // Add text before mention
        if (mentionStart > lastIndex) {
          fragments.push({
            text: text.substring(lastIndex, mentionStart),
            isMention: false,
          });
        }
        
        // Add mention
        fragments.push({
          text: localMatch[0],
          isMention: true,
          username: localMatch[1],
        });
        
        lastIndex = mentionEnd;
      }
      
      // Add remaining text
      if (lastIndex < text.length) {
        fragments.push({
          text: text.substring(lastIndex),
          isMention: false,
        });
      }
      
      // If we found mentions, replace the text node
      if (fragments.some(f => f.isMention)) {
        const parent = textNode.parentNode;
        if (parent) {
          // Create document fragment with new nodes
          const fragment = document.createDocumentFragment();
          
          for (const frag of fragments) {
            if (frag.isMention && frag.username) {
              // Check if this mention is already styled elsewhere
              const existingSpan = element.querySelector(`span[data-username="${frag.username}"]`);
              if (!existingSpan) {
                // Create styled span for mention
                const span = document.createElement('span');
                span.className = 'mention-input';
                span.setAttribute('data-username', frag.username);
                span.setAttribute('contenteditable', 'false');
                span.textContent = frag.text;
                fragment.appendChild(span);
              } else {
                // Already styled, just add as text
                fragment.appendChild(document.createTextNode(frag.text));
              }
            } else {
              // Regular text
              fragment.appendChild(document.createTextNode(frag.text));
            }
          }
          
          // Replace the text node with the fragment
          parent.replaceChild(fragment, textNode);
        }
      }
    }

    // Restore cursor position
    if (savedCursorPos >= 0) {
      try {
        const newRange = document.createRange();
        const newWalker = document.createTreeWalker(
          element,
          NodeFilter.SHOW_TEXT,
          null,
        );

        let currentPos = 0;
        let targetNode: Node = element;
        let targetOffset = 0;

        let newNode: Node | null;
        while ((newNode = newWalker.nextNode())) {
          const nodeLength = (newNode as Text).textContent?.length || 0;
          if (currentPos + nodeLength >= savedCursorPos) {
            targetNode = newNode as Text;
            targetOffset = savedCursorPos - currentPos;
            break;
          }
          currentPos += nodeLength;
        }

        newRange.setStart(
          targetNode,
          Math.min(targetOffset, (targetNode as Text).textContent?.length || 0),
        );
        newRange.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(newRange);
      } catch {
        // Fallback: place cursor at end
        const newRange = document.createRange();
        newRange.selectNodeContents(element);
        newRange.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(newRange);
      }
    }
  }
};

// Check for mention triggers (@username) for autocomplete
const checkForMentions = () => {
  if (!commentInputRef.value) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const textContent = commentInputRef.value.textContent || "";

  // Get cursor position in the text
  let cursorPos = 0;
  const walker = document.createTreeWalker(
    commentInputRef.value,
    NodeFilter.SHOW_TEXT,
    null,
  );

  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node === range.startContainer) {
      cursorPos += range.startOffset;
      break;
    }
    cursorPos += (node as Text).textContent?.length || 0;
  }

  const textBeforeCursor = textContent.substring(0, cursorPos);

  // Find the last @ symbol before cursor
  const atIndex = textBeforeCursor.lastIndexOf("@");

  if (atIndex === -1) {
    hideMentionDropdown();
    return;
  }

  // Check if @ is at start or preceded by whitespace
  const charBeforeAt = atIndex > 0 ? textBeforeCursor[atIndex - 1] : " ";
  if (charBeforeAt !== " " && charBeforeAt !== "\n" && atIndex !== 0) {
    hideMentionDropdown();
    return;
  }

  // Get the text after @ symbol
  const textAfterAt = textBeforeCursor.substring(atIndex + 1);

  // Check if there's whitespace in the mention query
  if (textAfterAt.includes(" ") || textAfterAt.includes("\n")) {
    hideMentionDropdown();
    return;
  }

  // Update mention state
  mentionStartPos.value = atIndex;
  mentionEndPos.value = cursorPos;
  currentMentionQuery.value = textAfterAt;

  // Search for users if query is long enough (reduced from 1 to allow single character searches)
  if (textAfterAt.length >= 1) {
    searchUsers(textAfterAt);
  } else {
    // Don't hide dropdown immediately, just clear suggestions
    mentionSuggestions.value = [];
    showMentionDropdown.value = false;
  }
};

// Search users for mention autocomplete
const searchUsers = async (query: string) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Shorter debounce for more responsive typing
  searchTimeout = setTimeout(async () => {
    try {
      console.log(`🔎 Searching users for mention: "${query}"`);

      const response = await fetch(
        `${API_URL}/posts/users/search?q=${encodeURIComponent(query)}&limit=10`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        console.error("Failed to search users:", response.statusText);
        return;
      }

      const users = await response.json();
      console.log(`🔎 Found ${users.length} users:`, users);

      mentionSuggestions.value = users;
      selectedSuggestionIndex.value = 0;

      if (users.length > 0) {
        showMentionDropdown.value = true;
        await nextTick();
        updateDropdownPosition();
      } else {
        showMentionDropdown.value = false;
      }
    } catch (error) {
      console.error("Error searching users:", error);
      hideMentionDropdown();
    }
  }, 200); // Reduced debounce time for more responsive search
};

// Update dropdown position
const updateDropdownPosition = () => {
  if (!commentInputRef.value || !dropdownRef.value) return;

  const inputRect = commentInputRef.value.getBoundingClientRect();

  // Position dropdown below the input
  dropdownStyle.value = {
    top: `${inputRect.height + 4}px`,
    left: "0px",
    width: "300px",
    maxWidth: "100%",
  };
};

// Hide mention dropdown
const hideMentionDropdown = () => {
  showMentionDropdown.value = false;
  mentionSuggestions.value = [];
  currentMentionQuery.value = "";
};

// Select a mention from dropdown
const selectMention = (user: User) => {
  if (!commentInputRef.value) return;

  const textContent = commentInputRef.value.textContent || "";
  const beforeMention = textContent.substring(0, mentionStartPos.value);
  const afterMention = textContent.substring(mentionEndPos.value);

  // Create new content with the mention
  const newText = beforeMention + `@${user.login} ` + afterMention;

  // Update the content safely using textContent
  commentInputRef.value.textContent = newText;

  // Process mentions to style the new one
  processMentions(commentInputRef.value);

  // Update content state
  hasContent.value = newText.trim().length > 0;

  // Set cursor position after the mention
  const newCursorPos = mentionStartPos.value + user.login.length + 2; // +2 for @ and space

  nextTick(() => {
    if (commentInputRef.value) {
      commentInputRef.value.focus();

      // Set cursor position
      const range = document.createRange();
      const selection = window.getSelection();

      try {
        const walker = document.createTreeWalker(
          commentInputRef.value,
          NodeFilter.SHOW_TEXT,
          null,
        );

        let currentPos = 0;
        let targetNode: Node = commentInputRef.value;
        let targetOffset = newCursorPos;

        let node: Node | null;
        while ((node = walker.nextNode())) {
          const nodeLength = (node as Text).textContent?.length || 0;
          if (currentPos + nodeLength >= newCursorPos) {
            targetNode = node;
            targetOffset = newCursorPos - currentPos;
            break;
          }
          currentPos += nodeLength;
        }

        range.setStart(
          targetNode,
          Math.min(targetOffset, (targetNode as Text).textContent?.length || 0),
        );
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      } catch (e) {
        console.error("Error setting cursor position:", e);
      }
    }
  });

  hideMentionDropdown();
};

// Handle input changes
const onInput = async (event: Event) => {
  const target = event.target as HTMLDivElement;

  // Check if there's actual content
  const textContent = target.textContent || target.innerText || "";
  hasContent.value = textContent.trim().length > 0;

  // Process mentions and check for new mentions immediately
  // but in a non-blocking way
  setTimeout(() => {
    processMentions(target);
    checkForMentions();
  }, 0); // Use setTimeout with 0 to make it non-blocking
};

// Handle paste events
const onPaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const text = event.clipboardData?.getData("text") || "";
  document.execCommand("insertText", false, text);
};

// Handle keyboard navigation in dropdown
const onKeyDown = (event: KeyboardEvent) => {
  // Only handle specific navigation keys when dropdown is visible
  if (showMentionDropdown.value && mentionSuggestions.value.length > 0) {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        selectedSuggestionIndex.value = Math.min(
          selectedSuggestionIndex.value + 1,
          mentionSuggestions.value.length - 1,
        );
        return; // Don't process further
      }

      case "ArrowUp": {
        event.preventDefault();
        selectedSuggestionIndex.value = Math.max(
          selectedSuggestionIndex.value - 1,
          0,
        );
        return; // Don't process further
      }

      case "Tab": {
        // Only select mention if there's a valid selection
        if (
          selectedSuggestionIndex.value >= 0 &&
          selectedSuggestionIndex.value < mentionSuggestions.value.length
        ) {
          event.preventDefault();
          const selectedUser =
            mentionSuggestions.value[selectedSuggestionIndex.value];
          if (selectedUser) {
            selectMention(selectedUser);
          }
          return;
        }
        // Otherwise let Tab work normally
        break;
      }

      case "Enter": {
        // Only handle Enter for mention selection, not for submission
        if (
          selectedSuggestionIndex.value >= 0 &&
          selectedSuggestionIndex.value < mentionSuggestions.value.length
        ) {
          event.preventDefault();
          const selectedUser =
            mentionSuggestions.value[selectedSuggestionIndex.value];
          if (selectedUser) {
            selectMention(selectedUser);
          }
          return;
        }
        // If no valid selection, let Enter submit the comment
        break;
      }

      case "Escape": {
        event.preventDefault();
        hideMentionDropdown();
        return;
      }

      // For ALL other keys (including letters, numbers, backspace, etc.)
      // Let them pass through normally - DO NOT PREVENT DEFAULT
      default:
        break;
    }
  }

  // Handle Enter for submission only when dropdown is not active or no selection
  if (event.key === "Enter" && !event.shiftKey) {
    // Only submit if dropdown is not showing or no mention is selected
    if (!showMentionDropdown.value || selectedSuggestionIndex.value < 0) {
      event.preventDefault();
      submitComment();
    }
  }
};

function submitComment() {
  if (!commentInputRef.value || !hasContent.value || props.disabled) return;

  const content =
    commentInputRef.value.textContent || commentInputRef.value.innerText;
  if (!content.trim()) return;

  emit("submit", content.trim());

  // Clear input after submit - using textContent instead of innerHTML
  commentInputRef.value.textContent = "";
  hasContent.value = false;
}

// Error handling for avatars
const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "/default-avatar.png";
};

// Expose methods for parent component
defineExpose({
  clearComment: () => {
    if (commentInputRef.value) {
      commentInputRef.value.textContent = "";
      hasContent.value = false;
    }
  },
  focusInput: () => {
    commentInputRef.value?.focus();
  },
});
</script>

<style scoped>
/* Style for mentions in the input */
:deep(.mention-input) {
  color: #6d01d0 !important;
  font-weight: 600;
  background-color: rgba(109, 1, 208, 0.1);
  padding: 1px 4px;
  border-radius: 3px;
  border: 1px solid rgba(109, 1, 208, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  margin: 0 1px;
}

:deep(.mention-input:hover) {
  background-color: rgba(109, 1, 208, 0.2);
  border-color: rgba(109, 1, 208, 0.5);
  color: #8b4cd8 !important;
  box-shadow: 0 0 4px rgba(109, 1, 208, 0.3);
}

/* Placeholder styling */
[contenteditable]:empty:before {
  content: attr(data-placeholder);
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

[contenteditable]:focus:before {
  content: "";
}

/* Remove default focus outline */
[contenteditable]:focus {
  outline: none;
}

/* Custom scrollbar for input */
[contenteditable] {
  scrollbar-width: thin;
  scrollbar-color: #6b7280 #374151;
}

[contenteditable]::-webkit-scrollbar {
  width: 4px;
}

[contenteditable]::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 2px;
}

[contenteditable]::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 2px;
}

[contenteditable]::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Custom scrollbar for dropdown */
:deep(.overflow-y-auto::-webkit-scrollbar) {
  width: 4px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-track) {
  background: #374151;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb) {
  background: #6b7280;
  border-radius: 2px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
  background: #9ca3af;
}
</style>
