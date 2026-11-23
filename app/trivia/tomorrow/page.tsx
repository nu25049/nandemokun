import {CONVERSATION_TOPICS} from '../../../lib/conversation-topics';
import TriviaNavigation from '../trivia-navigation';
import TopicPanel from './topic-panel';

export const metadata = {
 title: '明日の話のネタ | 暇な君へ',
 description: '食べ物や身近なもの、科学や文化の雑学に、会話を始める一言を添えました。',
};

export default function TomorrowTriviaPage() {
 return <>
  <h1 id="trivia-title">明日の話のネタ</h1>
  <TriviaNavigation active="tomorrow" />
  <TopicPanel topics={CONVERSATION_TOPICS} />
 </>;
}
