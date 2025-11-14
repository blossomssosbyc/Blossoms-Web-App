import FlowingMenu from '../components/FlowingMenu';

const menuItems = [
  { link: '/', text: 'Home', image: 'https://picsum.photos/600/400?random=1' },
  { link: '/points', text: 'Points Dashboard', image: 'https://picsum.photos/600/400?random=2' },
  { link: '/timeline', text: 'Events Timeline', image: 'https://picsum.photos/600/400?random=3' },
  { link: '/gallery', text: 'Gallery', image: 'https://picsum.photos/600/400?random=4' },
  { link: '/report', text: 'Reports', image: 'https://picsum.photos/600/400?random=5' }
];

export default function MenuPage() {
  return (
    <div className="h-screen w-screen relative bg-primary" data-testid="page-menu">
      <FlowingMenu items={menuItems} />
    </div>
  );
}
