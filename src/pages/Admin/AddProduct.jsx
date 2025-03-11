/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useAddProduct } from "@/api/addProduct";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import axiosInstance from "@/utils/axios";
import { Checkbox } from "@/components/ui/checkbox";

const ImageUpload = ({ images, setImages }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      setImages((prevImages) => [
        ...prevImages,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
    [setImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: true,
  });

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here ...</p>
        ) : (
          <p>Drag 'n' drop some images here, or click to select images</p>
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((file, index) => (
          <div key={index} className="relative">
            <img
              src={file.preview}
              alt={`preview ${index}`}
              className="w-full h-24 object-cover rounded-md"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  price: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Price must be a number.",
  }),
  category: z.enum(["Men", "Women", "Kids"], {
    message: "Please select a valid category.",
  }),
  sizes: z.array(z.enum(["S", "M", "L", "XL", "XXL"])).nonempty({
    message: "Please select at least one size.",
  }),
  color: z.string().min(1, { message: "Please enter a color." }),
});

const AddProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const { mutate: addProduct, isLoading, isError, error } = useAddProduct();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      sizes: [],
      color: "",
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Upload images and get back URLs
      const imageUrls = await uploadImages(images);
      console.log("Image URLs:", imageUrls);
      // Prepare the product data
      const productData = {
        ...values,
        price: parseFloat(values.price),
        images: imageUrls,
      };

      // Use the addProduct mutation to add the product
      await addProduct(productData);

      // Reset form and state after successful submission
      form.reset();
      setImages([]);
      // You might want to show a success message here
    } catch (error) {
      console.error("Error adding product:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  // This function would handle the actual image upload to your server or cloud storage
  const uploadImages = async (images) => {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axiosInstance.post("/upload-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    }
  };
  const sizes = ["S", "M", "L", "XL", "XXL"];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Men">Men</SelectItem>
                          <SelectItem value="Women">Women</SelectItem>
                          <SelectItem value="Kids">Kids</SelectItem>
                          <SelectItem value="Accessories">
                            Accessories
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sizes"
                  render={() => (
                    <FormItem>
                      <FormLabel>Sizes</FormLabel>
                      <div className="flex flex-wrap gap-4">
                        {sizes.map((size) => (
                          <FormField
                            key={size}
                            control={form.control}
                            name="sizes"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={size}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(size)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              size,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== size
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {size}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <ImageUpload images={images} setImages={setImages} />
                  </FormControl>
                  <FormDescription>
                    Upload one or more product images
                  </FormDescription>
                </FormItem>
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <ReactQuill
                        theme="snow"
                        placeholder="Enter product description"
                        {...field}
                        onChange={(content) => field.onChange(content)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full text-white"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Product...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Add Product
                  </>
                )}
              </Button>

              {isError && (
                <p className="text-red-500 text-sm mt-2">
                  Error adding product: {error.message}
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AddProduct;
