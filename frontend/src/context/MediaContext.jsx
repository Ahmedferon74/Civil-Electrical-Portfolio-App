import React, { createContext, useContext, useState, useEffect } from "react";

// إنشاء السياق
const MediaContext = createContext();

// هوك مخصص للوصول إلى السياق بسهولة
export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) throw new Error("useMedia must be used within a MediaProvider");
  return context;
};

// المزود الرئيسي للسياق
export const MediaProvider = ({ children }) => {
  const [mediaItems, setMediaItems] = useState([]);

  // الرابط الأساسي من environment variable أو localhost كخيار افتراضي
  const API_BASE = import.meta.env.VITE_API_URL || window.location.origin;

  // تحميل الوسائط من localStorage
  const loadMediaFromStorage = () => {
    try {
      const storedMedia = localStorage.getItem('civil-electrical-media');
      if (storedMedia) {
        const parsedMedia = JSON.parse(storedMedia);
        setMediaItems(parsedMedia);
      }
    } catch (err) {
      console.error("❌ فشل تحميل البيانات من التخزين المحلي:", err.message);
    }
  };

  // حفظ الوسائط في localStorage
  const saveMediaToStorage = (media) => {
    try {
      localStorage.setItem('civil-electrical-media', JSON.stringify(media));
    } catch (err) {
      console.error("❌ فشل حفظ البيانات في التخزين المحلي:", err.message);
    }
  };

  // تحميل البيانات عند بداية التشغيل
  useEffect(() => {
    loadMediaFromStorage();
  }, []);

  // حفظ البيانات كلما تغيرت
  useEffect(() => {
    if (mediaItems.length > 0) {
      saveMediaToStorage(mediaItems);
    }
  }, [mediaItems]);

  // إضافة عنصر وسائط جديد
  const addMedia = async (item) => {
    if (!item || !item.title || !item.url || !item.type) return;

    try {
      const newItem = {
        ...item,
        id: Date.now() + Math.random(), // إنشاء ID فريد
        timestamp: new Date().toISOString()
      };

      setMediaItems((prev) => {
        const updated = [newItem, ...prev];
        saveMediaToStorage(updated);
        return updated;
      });

      console.log("✅ تمت إضافة العنصر محليًا:", newItem.title);
    } catch (err) {
      console.error("❌ خطأ أثناء الإضافة:", err.message);
      alert(`⚠️ لم يتم حفظ الملف: ${err.message}`);
    }
  };

  // حذف عنصر وسائط
  const deleteMedia = async (id) => {
    try {
      setMediaItems((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        saveMediaToStorage(updated);
        return updated;
      });
      console.log("✅ تم حذف العنصر محليًا");
    } catch (err) {
      console.error("❌ خطأ أثناء الحذف:", err.message);
      alert(`⚠️ لم يتم حذف العنصر: ${err.message}`);
    }
  };

  // تحديث عنصر وسائط
  const updateMedia = async (id, updatedItem) => {
    try {
      setMediaItems((prev) => {
        const updated = prev.map((item) => 
          item.id === id ? { ...item, ...updatedItem } : item
        );
        saveMediaToStorage(updated);
        return updated;
      });
      console.log("✅ تم تحديث العنصر محليًا");
    } catch (err) {
      console.error("❌ خطأ أثناء التحديث:", err.message);
      alert(`⚠️ لم يتم تحديث العنصر: ${err.message}`);
    }
  };

  // مسح جميع البيانات
  const clearAllMedia = () => {
    try {
      localStorage.removeItem('civil-electrical-media');
      setMediaItems([]);
      console.log("✅ تم مسح جميع البيانات");
    } catch (err) {
      console.error("❌ خطأ أثناء مسح البيانات:", err.message);
    }
  };

  // تصدير البيانات
  const exportMedia = () => {
    try {
      const dataStr = JSON.stringify(mediaItems, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `civil-electrical-media-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      console.log("✅ تم تصدير البيانات");
    } catch (err) {
      console.error("❌ خطأ أثناء تصدير البيانات:", err.message);
    }
  };

  // استيراد البيانات
  const importMedia = (file) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (Array.isArray(importedData)) {
            setMediaItems(importedData);
            saveMediaToStorage(importedData);
            console.log("✅ تم استيراد البيانات");
          } else {
            throw new Error("تنسيق الملف غير صحيح");
          }
        } catch (parseErr) {
          console.error("❌ خطأ في تحليل الملف:", parseErr.message);
          alert("❌ ملف غير صالح");
        }
      };
      reader.readAsText(file);
    } catch (err) {
      console.error("❌ خطأ أثناء استيراد البيانات:", err.message);
    }
  };

  return (
    <MediaContext.Provider
      value={{
        mediaItems,
        addMedia,
        deleteMedia,
        updateMedia,
        clearAllMedia,
        exportMedia,
        importMedia,
        fetchMedia: loadMediaFromStorage, // للتوافق مع الكود الحالي
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

