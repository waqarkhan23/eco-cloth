import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  Search,
  X,
  Check,
  MessageSquare,
  Trash,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { formatDistance } from "date-fns";
import api from "@/utils/axios"
const API_URL = import.meta.env.VITE_API_URL;

const ManageQA = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ id: null, type: null });

  const queryClient = useQueryClient();

  // Fetch all questions across all products
  const fetchAllQuestions = async () => {
    // This is a simplified approach - in a real app, you'd want pagination
    const products = await api.get(`/products`);
    
    const allQuestions = [];
    for (const product of products.data.products) {
      try {
        const { data } = await api.get(`/qa/product/${product._id}`);
        if (data.questions.length > 0) {
          // Add product name to each question for display
          const questionsWithProduct = data.questions.map(q => ({
            ...q,
            productName: product.name,
            productId: product._id
          }));
          allQuestions.push(...questionsWithProduct);
        }
      } catch (error) {
        console.error(`Error fetching questions for product ${product._id}:`, error);
      }
    }
    
    return allQuestions;
  };

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["allProductQuestions"],
    queryFn: fetchAllQuestions,
  });

  // Add an answer
  const addAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answerData }) => {
      const { data } = await api.post(
        `/qa/question/${questionId}/answer`,
        {
          ...answerData,
          isAdmin: true,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allProductQuestions"]);
      toast.success("Answer added successfully");
      setIsAnswerDialogOpen(false);
      setAnswerText("");
    },
    onError: (error) => {
      toast.error("Failed to add answer: " + error.message);
    },
  });

  // Delete a question
  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId) => {
      const { data } = await api.delete(`/qa/question/${questionId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allProductQuestions"]);
      toast.success("Question deleted successfully");
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to delete question: " + error.message);
    },
  });

  // Delete an answer
  const deleteAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answerId }) => {
      const { data } = await api.delete(
        `/qa/question/${questionId}/answer/${answerId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allProductQuestions"]);
      toast.success("Answer deleted successfully");
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to delete answer: " + error.message);
    },
  });

  const handleAddAnswer = () => {
    if (!answerText.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }

    addAnswerMutation.mutate({
      questionId: selectedQuestionId,
      answerData: {
        text: answerText,
        answeredBy: "Store Admin",
      },
    });
  };

  const handleDeleteItem = () => {
    if (itemToDelete.type === "question") {
      deleteQuestionMutation.mutate(itemToDelete.id);
    } else if (itemToDelete.type === "answer") {
      deleteAnswerMutation.mutate({
        questionId: itemToDelete.questionId,
        answerId: itemToDelete.id,
      });
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      question.question.text.toLowerCase().includes(searchLower) ||
      question.question.askedBy.toLowerCase().includes(searchLower) ||
      question.productName.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return <div className="py-8 text-center">Loading questions...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Product Questions & Answers</h1>

      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            placeholder="Search questions by text, asker, or product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="text-center py-10">
          <MessageCircle className="mx-auto mb-4" size={48} />
          <p className="text-gray-500">No questions found</p>
        </div>
      ) : (
        <Table>
          <TableCaption>List of customer questions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Asked By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map((qaItem) => (
              <TableRow key={qaItem._id}>
                <TableCell className="font-medium">{qaItem.productName}</TableCell>
                <TableCell>{qaItem.question.text}</TableCell>
                <TableCell>{qaItem.question.askedBy}</TableCell>
                <TableCell>
                  {formatDistance(new Date(qaItem.question.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  {qaItem.answers.length > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Check size={12} className="mr-1" /> Answered
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Awaiting Answer
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedQuestionId(qaItem._id);
                        setIsAnswerDialogOpen(true);
                      }}
                    >
                      <MessageSquare size={16} className="mr-1" />
                      Answer
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setItemToDelete({
                          id: qaItem._id,
                          type: "question",
                        });
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Answer Dialog */}
      <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide an Answer</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Write your official response here..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAnswerDialogOpen(false)}
            
            >
              Cancel
            </Button>
            <Button   className="text-white" onClick={handleAddAnswer}>Submit Answer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete this{" "}
              {itemToDelete.type === "question" ? "question" : "answer"}? This
              action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageQA; 