import React from 'react';
import '../styles/Skills.css';
import { useMedia } from '../context/MediaContext'; // استيراد useMedia

const Skills = () => {
  const { mediaItems } = useMedia(); // استخدام useMedia لجلب الوسائط

  const skills = [
    {
      category: 'الأعمال الكهربائية',
      icon: '⚡',
      color: '#3b82f6',
      items: [
        { name: 'تمديد أنظمة الكهرباء', level: 95, description: 'الإضاءة - الأنذار - القوى' },
        { name: 'قراءة المخططات الكهربائية', level: 90, description: 'باستخدام AutoCAD و Revit' },
        { name: 'تركيب التركيبات الكهربائية', level: 88, description: 'في المشاريع' },
        { name: 'كتابة الأحمال وتوزيع الدوائر الكهربائية', level: 85, description: '' },
        { name: 'العمل الجماعي والتنسيق', level: 92, description: 'مع فرق متعددة التخصصات' }
      ]
    },
    {
      category: 'أعمال السباكة',
      icon: '🔧',
      color: '#10b981',
      items: [
        { name: 'تمديد شبكات المياه', level: 90, description: 'للمباني السكنية والتجارية' },
        { name: 'تركيب الأدوات الصحية', level: 88, description: 'حسب أحدث المعايير' },
        { name: 'صيانة أنظمة السباكة', level: 85, description: 'الوقائية والطارئة' },
        { name: 'تمديد شبكات الصرف', level: 87, description: 'وفقاً للمواصفات' }
      ]
    },
    {
      category: 'المهارات التقنية',
      icon: '💻',
      color: '#f59e0b',
      items: [
        { name: 'AutoCAD', level: 85, description: 'لرسم المخططات الفنية' },
        { name: 'Revit', level: 80, description: 'للنمذجة ثلاثية الأبعاد' },
        { name: 'أنظمة الأمان والمراقبة', level: 88, description: 'كاميرات وأنذار حريق' },
        { name: 'قراءة المواصفات الفنية', level: 92, description: 'والمعايير السعودية' }
      ]
    },
    {
      category: 'المهارات الشخصية',
      icon: '🎯',
      color: '#8b5cf6',
      items: [
        { name: 'إدارة المشاريع', level: 88, description: 'التخطيط والتنفيذ' },
        { name: 'حل المشاكل', level: 90, description: 'بطرق إبداعية وفعالة' },
        { name: 'التواصل الفعال', level: 85, description: 'مع العملاء والفرق' },
        { name: 'الالتزام بالمواعيد', level: 95, description: 'والجودة المطلوبة' }
      ]
    }
  ];

  const certifications = [
    {
      title: 'شهادة السلامة المهنية',
      issuer: 'المؤسسة العامة للتدريب التقني',
      year: '2023',
      icon: '🛡️'
    },
    {
      title: 'دورة AutoCAD المتقدمة',
      issuer: 'معهد التدريب التقني',
      year: '2022',
      icon: '📐'
    },
    {
      title: 'شهادة أنظمة الإنذار والحريق',
      issuer: 'الدفاع المدني السعودي',
      year: '2023',
      icon: '🚨'
    }
  ];

  return (
    <div className="skills-container">
      {/* العنوان الرئيسي */}
      <div className="skills-header">
        <h1 className="skills-title">🛠️ المهارات الفنية</h1>
        <p className="skills-subtitle">
          خبرة متنوعة في مجالات الكهرباء والسباكة والأعمال المدنية
        </p>
      </div>

      {/* قسم المهارات */}
      <div className="skills-grid">
        {skills.map((category, categoryIndex) => (
          <div key={categoryIndex} className="skill-category" style={{ '--category-color': category.color }}>
            <div className="category-header">
              <span className="category-icon">{category.icon}</span>
              <h2 className="category-title">{category.category}</h2>
            </div>
            
            <div className="skills-list">
              {category.items.map((skill, skillIndex) => (
                <div key={skillIndex} className="skill-item">
                  <div className="skill-info">
                    <h3 className="skill-name">{skill.name}</h3>
                    {skill.description && (
                      <p className="skill-description">{skill.description}</p>
                    )}
                  </div>
                  
                  <div className="skill-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${skill.level}%`,
                          backgroundColor: category.color
                        }}
                      ></div>
                    </div>
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* قسم الشهادات */}
      <div className="certifications-section">
        <h2 className="section-title">🏆 الشهادات والدورات</h2>
        <div className="certifications-grid">
          {certifications.map((cert, index) => (
            <div key={index} className="certification-card">
              <div className="cert-icon">{cert.icon}</div>
              <h3 className="cert-title">{cert.title}</h3>
              <p className="cert-issuer">{cert.issuer}</p>
              <span className="cert-year">{cert.year}</span>
            </div>
          ))}
        </div>
      </div>

      {/* قسم المعرض الفني */}
      <div className="portfolio-section">
        <h2 className="section-title">📸 المعرض الفني</h2>
        
        {mediaItems.length === 0 ? (
          <div className="empty-portfolio">
            <div className="empty-icon">📁</div>
            <h3>لا توجد أعمال في المعرض حالياً</h3>
            <p>يمكنك إضافة أعمالك من خلال لوحة التحكم.</p>
          </div>
        ) : (
          <div className="media-grid">
            {mediaItems.map((item) => (
              <div key={item.id} className="media-item">
                {item.type === 'image' ? (
                  <div className="image-container">
                    <img 
                      src={item.url} 
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=فشل+تحميل+الصورة';
                      }}
                    />
                    <div className="media-overlay">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ) : (
                  item.url.includes('youtube.com') || item.url.includes('youtu.be') ? (
                    <div className="video-container">
                      <iframe
                        src={item.url}
                        title={item.title}
                        frameBorder="0"
                        allowFullScreen
                        sandbox="allow-same-origin allow-scripts allow-presentation"
                      />
                      <div className="media-overlay">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="video-container">
                      <video 
                        controls 
                        poster={item.thumbnail || ''}
                        preload="metadata"
                      >
                        <source src={item.url} type="video/mp4" />
                        متصفحك لا يدعم تشغيل الفيديو
                      </video>
                      <div className="media-overlay">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* روابط الوسائط */}
      <div className="media-links-section">
        <h2 className="section-title">🔗 روابط الوسائط</h2>
        <div className="links-grid">
          <a 
            href="https://via.placeholder.com/600x400?text=فشل+الاتصال" 
            target="_blank" 
            rel="noopener noreferrer"
            className="media-link"
          >
            <span className="link-icon">🔗</span>
            <span className="link-text">كتالوج الأعمال</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Skills;


