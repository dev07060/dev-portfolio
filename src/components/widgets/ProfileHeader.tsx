import { Code2, Github, Notebook, Mail } from 'lucide-react';
import SocialButton from '@/components/SocialButton';

const ProfileHeader = () => {
  return (
    <header className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 animate-fade-in-up relative z-20">
        {/* Profile Avatar */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-600">
            <Code2 size={40} className="text-cyan-400" />
          </div>
        </div>

        {/* Profile Info */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
            Byeonghee Oh
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
            사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.
            <br />
            모바일 앱과 웹의 경계를 허무는 몰입형 인터페이스를 만듭니다.
          </p>

          {/* Social Links */}
          <div className="flex gap-4 mt-6">
            <SocialButton icon={<Github size={20} />} label="GitHub" href='https://github.com/dev07060'/>
            <SocialButton icon={<Notebook size={20} />} label="Blog" href='https://devblog-fawn.vercel.app'/>
            <SocialButton icon={<Mail size={20} />} label="Email" href='mailto:byeongheeoh51@gmail.com'/>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
