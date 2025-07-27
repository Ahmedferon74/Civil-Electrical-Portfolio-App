import React, { useState } from "react";
import { useMedia } from "../context/MediaContext";

const Admin = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [file, setFile] = useState(null);
  const [code, setCode] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mediaItems, addMedia, deleteMedia, clearAllMedia, exportMedia, importMedia } = useMedia();

  const handleAccess = () => {
    const validCode = import.meta.env.VITE_ADMIN_CODE || "123456";
    if (code === validCode) {
      setAccessGranted(true);
    } else {
      alert("❌ الرمز غير صحيح");
    }
  };

  // تحويل الملف إلى Base64 للحفظ المحلي
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || (!mediaUrl && !file)) {
      return alert("⚠️ يرجى ملء جميع الحقول");
    }

    let uploadedUrl = mediaUrl;
    let type = "video";

    try {
      setLoading(true);

      if (file) {
        if (file.size > 50 * 1024 * 1024) { // 50MB limit for local storage
          alert("❌ لا يمكن رفع ملف أكبر من 50 ميجا بايت");
          setLoading(false);
          return;
        }

        // تحويل الملف إلى Base64 للحفظ المحلي
        uploadedUrl = await fileToBase64(file);
        type = file.type.startsWith("video") ? "video" : "image";
      } else {
        if (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be")) {
          type = "video";
        } else {
          type = "image";
        }
      }

      await addMedia({ 
        title, 
        description, 
        url: uploadedUrl, 
        type,
        fileName: file ? file.name : null,
        fileSize: file ? file.size : null,
        uploadDate: new Date().toISOString()
      });

      alert("✅ تمت الإضافة بنجاح وحُفظت محليًا");

      setTitle("");
      setDescription("");
      setFile(null);
      setMediaUrl("");
    } catch (err) {
      console.error("❌ خطأ في حفظ الملف:", err.message);
      alert(`❌ حدث خطأ أثناء حفظ الملف: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
      importMedia(file);
      alert("✅ تم استيراد البيانات بنجاح");
    } else {
      alert("❌ يرجى اختيار ملف JSON صالح");
    }
  };

  const handleClearAll = () => {
    if (window.confirm("⚠️ هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.")) {
      clearAllMedia();
      alert("✅ تم مسح جميع البيانات");
    }
  };

  return (
    <div className="admin-page">
      {!accessGranted ? (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
          <h3>🔐 أدخل رمز الدخول</h3>
          <input
            type="password"
            value={code}
            placeholder="رمز المشرف"
            onChange={(e) => setCode(e.target.value)}
            style={{ padding: "10px", width: "100%", margin: "10px 0" }}
          />
          <button onClick={handleAccess}>🔓 دخول</button>
        </div>
      ) : (
        <div>
          <h2>لوحة تحكم المشرف</h2>
          
          {/* أدوات إدارة البيانات */}
          <div className="data-management" style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3>🛠️ إدارة البيانات</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button onClick={exportMedia} style={{ backgroundColor: "#28a745", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px" }}>
                📥 تصدير البيانات
              </button>
              <label style={{ backgroundColor: "#17a2b8", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                📤 استيراد البيانات
                <input type="file" accept=".json" onChange={handleFileImport} style={{ display: "none" }} />
              </label>
              <button onClick={handleClearAll} style={{ backgroundColor: "#dc3545", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px" }}>
                🗑️ مسح جميع البيانات
              </button>
            </div>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
              💾 جميع البيانات محفوظة محليًا في متصفحك. استخدم التصدير لعمل نسخة احتياطية.
            </p>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="عنوان المادة"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="وصف مختصر"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label>📁 اختر ملف من الجهاز (سيُحفظ محليًا):</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <label>🌐 أو أدخل رابط مباشر (YouTube / صورة):</label>
            <input
              type="text"
              placeholder="https://youtube.com/embed/..."
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
            />

            <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "⏳ جاري الحفظ..." : "💾 حفظ محليًا"}
            </button>
          </form>

          <h3 style={{ marginTop: "30px" }}>📂 المواد المحفوظة ({mediaItems.length}):</h3>
          {mediaItems.length === 0 ? (
            <p>🚫 لا توجد مواد محفوظة بعد.</p>
          ) : (
            <div>
              {mediaItems.map((item) => (
                <div key={`media-${item.id}`} className="media-item" style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  {item.fileName && (
                    <p style={{ fontSize: "12px", color: "#666" }}>
                      📎 {item.fileName} ({(item.fileSize / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  {item.type === "video" ? (
                    item.url.startsWith("data:") ? (
                      <video 
                        src={item.url} 
                        controls 
                        style={{ maxWidth: "100%", height: "auto" }}
                        title={item.title}
                      />
                    ) : (
                      <div className="video-wrapper">
                        <iframe
                          src={item.url}
                          title={item.title}
                          frameBorder="0"
                          allowFullScreen
                          sandbox="allow-same-origin allow-scripts allow-presentation"
                        />
                      </div>
                    )
                  ) : (
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="image-preview" 
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  )}
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteMedia(item.id)}
                    style={{ backgroundColor: "#dc3545", color: "white", padding: "5px 10px", border: "none", borderRadius: "4px", marginTop: "10px" }}
                  >
                    🗑 حذف
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;

