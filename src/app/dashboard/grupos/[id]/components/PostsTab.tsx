"use client";

import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGroupPosts, useCreatePost } from "@/hooks/useGroupResources";
import { useUserProfile } from "@/hooks/hooks";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { io } from "socket.io-client";
import { cn } from "@/lib/utils";

export function PostsTab({ groupId }: { groupId: string }) {
  const { data: posts, isLoading } = useGroupPosts(groupId);
  const { data: user } = useUserProfile();
  const createPost = useCreatePost();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333");
    
    socket.emit("join_group", groupId);

    socket.on("new_post", () => {
      queryClient.invalidateQueries({ queryKey: ["groupPosts", groupId] });
    });

    return () => {
      socket.disconnect();
    };
  }, [groupId, queryClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    createPost.mutate(
      { groupId, content },
      {
        onSuccess: () => setContent("")
      }
    );
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50/50 relative rounded-b-xl overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 relative z-10 scrollbar-thin scrollbar-thumb-gray-200">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-gray-500" /></div>
        ) : posts?.length === 0 ? (
          <div className="text-center py-6 text-gray-500 flex flex-col items-center bg-white border border-gray-100 mx-auto px-6 rounded-2xl shadow-sm">
            <MessageSquare className="h-10 w-10 text-gray-300 mb-3" />
            <p className="font-medium text-gray-700">Nenhuma mensagem ainda.</p>
            <p className="text-sm">Seja o primeiro a puxar assunto no grupo!</p>
          </div>
        ) : (
          [...(posts || [])].reverse().map((post) => {
            const isMe = user?.id && String(post.author?.id) === String(user.id);
            return (
              <div 
                key={post.id} 
                className={cn(
                  "flex flex-col max-w-[85%] md:max-w-[70%] px-3 py-2 shadow-sm relative",
                  isMe ? "bg-blue-600 text-white self-end rounded-2xl rounded-tr-none" : "bg-white border border-gray-100 self-start rounded-2xl rounded-tl-none"
                )}
              >
                {!isMe && (
                  <span className="font-bold text-[13px] text-gray-900 mb-0.5">
                    {post.author?.name || post.author?.email || "Usuário"}
                  </span>
                )}
                <p className={cn("text-[15px] whitespace-pre-wrap leading-relaxed", isMe ? "text-white" : "text-gray-700")}>
                  {post.content}
                </p>
                <span className={cn("text-[11px] self-end mt-1 font-medium ml-4", isMe ? "text-blue-100" : "text-gray-400")}>
                  {format(new Date(post.post_date), "HH:mm", { locale: ptBR })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-100 mt-auto relative z-10 shrink-0 w-full">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center w-full">
          <input 
            type="text" 
            placeholder="Digite uma mensagem..."
            className="flex-1 min-w-0 w-full rounded-full border border-gray-200 px-4 py-3 text-[15px] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={createPost.isPending}
          />
          <Button 
            type="submit" 
            disabled={!content.trim() || createPost.isPending} 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 p-0 flex items-center justify-center shrink-0 shadow-sm transition-colors"
          >
            {createPost.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
