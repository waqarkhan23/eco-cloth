/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Trash2 } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { useDropzone } from "react-dropzone";

const BannerContent = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newBanner, setNewBanner] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axiosInstance.get("/banners");
      setBanners(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const onDrop = (acceptedFiles) => {
    setNewBanner(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!newBanner) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", newBanner);

    try {
      await axiosInstance.post("/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewBanner(null);
      fetchBanners();
    } catch (error) {
      console.error("Error uploading banner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/banners/${id}`);
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

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
            Banner Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Upload New Banner</h3>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the banner image here ...</p>
              ) : (
                <p>Drag 'n' drop a banner image here, or click to select</p>
              )}
            </div>
            {newBanner && (
              <div className="mt-2">
                <p>{newBanner.name}</p>
                <Button onClick={handleUpload} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Banner
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Current Banners</h3>
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="flex items-center justify-between mb-2"
              >
                <img
                  src={banner.imageUrl}
                  alt="Banner"
                  className="w-32 h-16 object-cover rounded"
                />
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(banner._id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BannerContent;
