import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Search, Star } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useProductsQuery from "@/api/getProducts";
import Loader from "@/components/Loader";

import toast from "react-hot-toast";
import axiosInstance from "@/utils/axios";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: products, isLoading, isError, error } = useProductsQuery();

  const filteredProducts = products
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleDeleteClick = (productId) => {
    setDeleteProductId(productId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    try {
      const response = axiosInstance.delete(`/products/${deleteProductId}`);
      if (response.status === 200) {
        toast({
          type: "success",
          title: "Product deleted successfully",
        });
        setDeleteProductId(null);
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      toast({
        type: "error",
        title: error.message || "Error deleting product",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p>Error loading products: {error.message}</p>
      </div>
    );
  }

  const handleToggleFeatured = async (productId, currentFeaturedStatus) => {
    try {
      const response = await axiosInstance.put(
        `/products/featured/${productId}`,
        {
          isFeatured: !currentFeaturedStatus,
        }
      );
      if (response.status === 200) {
        toast.success("Featured Successfully");
      }
    } catch (error) {
      toast.error(error.message || "Error toggling product featured status");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Link to="/admin/products/add">
              <Button className="text-white">
                <Plus className="mr-2 h-4 w-4 text-white" /> Add Product
              </Button>
            </Link>
          </div>
          {products && products.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.category}</Badge>
                        </TableCell>
                        <TableCell>PKR {product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant={product.featured ? "default" : "outline"}
                            size="sm"
                            onClick={() =>
                              handleToggleFeatured(
                                product._id,
                                product.isFeatured
                              )
                            }
                          >
                            <Star
                              className={`h-4 w-4 mr-2 ${
                                product.isFeatured
                                  ? "text-yellow-400 fill-yellow-400"
                                  : ""
                              }`}
                            />
                            {product.isFeatured ? "Featured" : "Not Featured"}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteClick(product._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>No products found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Products;
