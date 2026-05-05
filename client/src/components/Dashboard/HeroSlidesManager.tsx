import React, { useEffect, useState } from "react";
import BASE_URL from "../../api/config";
import "./HeroSlidesManager.css";

interface Slide {
  _id: string;
  imageUrl: string;
  order: number;
  createdAt: string;
}

interface HeroSlidesManagerProps {
  token: string;
}

const HeroSlidesManager: React.FC<HeroSlidesManagerProps> = ({ token }) => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    order: "1",
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch slides on mount
  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/hero-slides`);

      if (!response.ok) {
        throw new Error("Failed to fetch slides");
      }

      const data = await response.json();
      setSlides(data.data.sort((a: Slide, b: Slide) => a.order - b.order));
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching slides:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle order change
  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, order: e.target.value }));
  };

  // Upload new slide
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      setError("Please select an image");
      return;
    }

    if (!formData.order) {
      setError("Please enter an order number");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const uploadFormData = new FormData();
      uploadFormData.append("image", formData.image);
      uploadFormData.append("order", formData.order);

      const response = await fetch(`${BASE_URL}/hero-slides`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload slide");
      }

      // Reset form and fetch slides
      setFormData({ order: "1", image: null });
      setPreviewUrl(null);
      if (document.querySelector('input[type="file"]')) {
        (document.querySelector('input[type="file"]') as HTMLInputElement).value = "";
      }

      await fetchSlides();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error uploading slide:", err);
    } finally {
      setUploading(false);
    }
  };

  // Delete slide
  const handleDelete = async (slideId: string) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) {
      return;
    }

    try {
      setDeleting(slideId);
      setError(null);

      const response = await fetch(`${BASE_URL}/hero-slides/${slideId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete slide");
      }

      await fetchSlides();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error deleting slide:", err);
    } finally {
      setDeleting(null);
    }
  };

  // Update slide order
  const handleUpdateOrder = async (slideId: string, newOrder: string) => {
    if (!newOrder) {
      setError("Order cannot be empty");
      return;
    }

    const orderNum = parseInt(newOrder, 10);
    if (isNaN(orderNum) || orderNum < 1) {
      setError("Order must be a positive number");
      return;
    }

    try {
      setUpdating(slideId);
      setError(null);

      const response = await fetch(`${BASE_URL}/hero-slides/${slideId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: orderNum }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update slide");
      }

      await fetchSlides();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error updating slide:", err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="hero-slides-manager">
      <div className="hero-slides-header">
        <h2 className="hero-slides-title">Hero Slides Manager</h2>
        <p className="hero-slides-subtitle">Manage slideshow images for the hero section</p>
      </div>

      {/* Error display */}
      {error && (
        <div className="hero-slides-error">
          <span>{error}</span>
          <button
            className="hero-slides-error-close"
            onClick={() => setError(null)}
            type="button"
          >
            ×
          </button>
        </div>
      )}

      <div className="hero-slides-container">
        {/* Upload form */}
        <div className="hero-slides-upload-section">
          <h3>Upload New Slide</h3>
          <form onSubmit={handleUpload} className="hero-slides-form">
            <div className="hero-slides-form-group">
              <label htmlFor="order">Order</label>
              <input
                id="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={handleOrderChange}
                disabled={uploading}
                required
              />
            </div>

            <div className="hero-slides-form-group">
              <label htmlFor="image">Image</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                required
              />
              <p className="hero-slides-form-help">Max 5MB, JPEG/PNG/WebP</p>
            </div>

            {previewUrl && (
              <div className="hero-slides-preview">
                <img src={previewUrl} alt="Preview" className="hero-slides-preview-image" />
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary"
              disabled={uploading || !formData.image}
            >
              {uploading ? "Uploading..." : "Upload Slide"}
            </button>
          </form>
        </div>

        {/* Slides grid */}
        <div className="hero-slides-grid-section">
          <h3>Current Slides</h3>

          {loading ? (
            <div className="hero-slides-loading">
              <p>Loading slides...</p>
            </div>
          ) : slides.length === 0 ? (
            <div className="hero-slides-empty">
              <p>No slides yet. Upload your first slide above.</p>
            </div>
          ) : (
            <div className="hero-slides-grid">
              {slides.map((slide) => (
                <div key={slide._id} className="hero-slides-card">
                  <div className="hero-slides-card-image">
                    <img src={slide.imageUrl} alt={`Slide ${slide.order}`} />
                  </div>

                  <div className="hero-slides-card-content">
                    <div className="hero-slides-card-order">
                      <label>Order:</label>
                      <input
                        type="number"
                        min="1"
                        defaultValue={slide.order}
                        onBlur={(e) => {
                          if (e.target.value !== String(slide.order)) {
                            handleUpdateOrder(slide._id, e.target.value);
                          }
                        }}
                        disabled={updating === slide._id}
                      />
                    </div>

                    <div className="hero-slides-card-date">
                      <small>
                        {new Date(slide.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </small>
                    </div>

                    <button
                      className="hero-slides-card-delete btn btn--danger"
                      onClick={() => handleDelete(slide._id)}
                      disabled={deleting === slide._id}
                      type="button"
                    >
                      {deleting === slide._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSlidesManager;
