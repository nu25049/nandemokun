import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: '暇な君へ | 次の一歩を、ひとつ。', description: '何をしようか迷ったら。自分の行動候補から次の一歩をひとつ提案します。' };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="ja"><body>{children}</body></html>; }
