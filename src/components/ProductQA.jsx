import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useProductQuestionsQuery, useAddQuestionMutation, useAddAnswerMutation } from "@/api/productQA";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, User, Calendar, Lock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import toast from "react-hot-toast";
import { formatDistance } from "date-fns";
import { useAuth } from "@/utils/AuthContext";

const ProductQA = ({ productId }) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { token, user } = useAuth();

  // Check if the user is an admin
  useEffect(() => {
    // Check localStorage for admin status
    const checkAdminStatus = () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          setIsAdmin(parsedUser.role === 'admin');
        } catch (error) {
          console.error('Error parsing user info:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [token, user]);

  const { data: questions = [], isLoading, isError } = useProductQuestionsQuery(productId);
  const addQuestionMutation = useAddQuestionMutation();
  const addAnswerMutation = useAddAnswerMutation();

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    
    if (!newQuestion.trim() || !name.trim() || !email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      await addQuestionMutation.mutateAsync({
        productId,
        questionData: {
          text: newQuestion,
          askedBy: name,
          email
        }
      });
      
      toast.success("Your question has been submitted");
      setNewQuestion("");
      setName("");
      setEmail("");
      setShowQuestionForm(false);
    } catch (error) {
      toast.error("Failed to submit question. Please try again.");
    }
  };

  const handleSubmitAnswer = async (questionId) => {
    if (!replyText.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      await addAnswerMutation.mutateAsync({
        questionId,
        productId,
        answerData: {
          text: replyText,
          answeredBy: user?.name || "Store Admin",
          isAdmin: true
        }
      });
      
      toast.success("Your answer has been submitted");
      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      toast.error("Failed to submit answer. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading questions...</div>;
  }

  if (isError) {
    return <div className="py-4">Error loading questions and answers.</div>;
  }

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Questions & Answers</h3>
        <Button 
          variant="outline" 
          onClick={() => setShowQuestionForm(!showQuestionForm)}
        >
          <MessageCircle className="mr-2" size={18} />
          {showQuestionForm ? "Cancel" : "Ask a Question"}
        </Button>
      </div>

      {showQuestionForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 border rounded-lg"
        >
          <h4 className="text-lg font-medium mb-3">Ask Your Question</h4>
          <form onSubmit={handleSubmitQuestion}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name *</label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Your Email *</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="question" className="block text-sm font-medium mb-1">Your Question *</label>
              <Textarea
                id="question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask a question about this product"
                required
                rows={4}
              />
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={addQuestionMutation.isLoading}
                className="text-white"
              >
                {addQuestionMutation.isLoading ? "Submitting..." : "Submit Question"}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {questions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="mx-auto mb-3" size={32} />
          <p>No questions yet. Be the first to ask a question about this product!</p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {questions.map((qaItem) => (
            <AccordionItem 
              key={qaItem._id} 
              value={qaItem._id}
              className="border rounded-lg p-4"
            >
              <AccordionTrigger className="flex items-start">
                <div className="text-left">
                  <div className="font-medium mb-1">{qaItem.question.text}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <User size={14} className="mr-1" />
                    <span className="mr-3">{qaItem.question.askedBy}</span>
                    <Calendar size={14} className="mr-1" />
                    <span>
                      {formatDistance(new Date(qaItem.question.createdAt), new Date(), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-4 space-y-4">
                  {qaItem.answers.length > 0 ? (
                    qaItem.answers.map((answer, index) => (
                      <div key={index} className={`p-3 rounded-lg ${answer.isAdmin ? 'bg-gray-100' : 'bg-blue-50'}`}>
                        <div className="mb-2">{answer.text}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <User size={14} className="mr-1" />
                          <span className="mr-2">
                            {answer.answeredBy} {answer.isAdmin && <span className="text-blue-600 font-semibold">(Official)</span>}
                          </span>
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {formatDistance(new Date(answer.createdAt), new Date(), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 italic">No answers yet</div>
                  )}
                </div>

                {replyingTo === qaItem._id ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-3 border rounded-lg"
                  >
                    <div className="mb-3">
                      <label htmlFor="replyText" className="block text-sm font-medium mb-1">Official Answer *</label>
                      <Textarea
                        id="replyText"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your official answer as an admin"
                        required
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => handleSubmitAnswer(qaItem._id)}
                        disabled={addAnswerMutation.isLoading}
                      >
                        {addAnswerMutation.isLoading ? "Submitting..." : "Submit Official Answer"}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  isAdmin && token ? (
                    <Button
                      variant="ghost"
                      className="mt-3"
                      onClick={() => setReplyingTo(qaItem._id)}
                    >
                      <Send className="mr-2" size={16} />
                      Reply as Admin
                    </Button>
                  ) : (
                    <div className="mt-3 text-sm text-gray-500 flex items-center">
                      <Lock size={14} className="mr-2" />
                      Only administrators can answer questions
                    </div>
                  )
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default ProductQA; 