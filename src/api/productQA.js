import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/axios";

const API_URL = import.meta.env.VITE_API_URL;

// Get all questions for a product
export const useProductQuestionsQuery = (productId) => {
  return useQuery({
    queryKey: ["productQuestions", productId],
    queryFn: async () => {
      const {data} = await api.get(`/qa/product/${productId}`);

      return data.questions;
    },
    enabled: !!productId,
  });
};

// Add a new question
export const useAddQuestionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, questionData }) => {
      const { data } = await api.post(
        `/qa/product/${productId}/question`,
        questionData
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["productQuestions", variables.productId]);
    },
  });
};

// Add an answer to a question
export const useAddAnswerMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ questionId, answerData, productId }) => {
      const { data } = await api.post(
        `/qa/question/${questionId}/answer`,
        answerData
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["productQuestions", variables.productId]);
    },
  });
};

// Delete a question (Admin only)
export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ questionId, productId }) => {
      const { data } = await api.delete(`/qa/question/${questionId}`);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["productQuestions", variables.productId]);
    },
  });
};

// Delete an answer (Admin only)
export const useDeleteAnswerMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ questionId, answerId, productId }) => {
      const { data } = await api.delete(
        `/qa/question/${questionId}/answer/${answerId}`
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["productQuestions", variables.productId]);
    },
  });
}; 