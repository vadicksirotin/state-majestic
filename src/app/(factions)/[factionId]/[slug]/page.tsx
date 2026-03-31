import { notFound } from 'next/navigation';
import { getFaction, type FactionId } from '@/config/factions';
import { prisma } from '@/lib/prisma';
import { 
  RanksList, 
  HighStaffList, 
  OrdersList, 
  CharterPage, 
  PassRequestForm, 
  DocsHub, 
  PlaceholderPage, 
  DocumentView 
} from '@/components/faction/FactionUnifiedPages';
import { ApplicationForm } from '@/components/faction/ApplicationForm';

interface PageProps {
  params: Promise<{ factionId: string, slug: string }>;
}

export default async function DynamicFactionPage({ params }: PageProps) {
  const resolvedParams = await params;
  const factionId = resolvedParams.factionId as FactionId;
  const slug = resolvedParams.slug;
  const faction = getFaction(factionId);

  if (!faction) return notFound();

  // Ищем кастомное название вкладки из конфига
  const navItem = faction.navItems.find(n => n.href.includes(`/${slug}`));
  const pageTitle = navItem ? navItem.label : slug.toUpperCase();

  switch(slug) {
    case 'ranks': return <RanksList faction={faction} />;
    case 'high-staff': return <HighStaffList faction={faction} />;
    case 'orders': 
    case 'decrees': return <OrdersList faction={faction} />;
    case 'drill': 
    case 'regulations': return <CharterPage faction={faction} />;
    case 'transfers': return <ApplicationForm factionId={factionId} type="transfer" title={pageTitle} />;
    case 'recovery': return <ApplicationForm factionId={factionId} type="recovery" title={pageTitle} />;
    case 'passes': return <PassRequestForm faction={faction} />;
    case 'docs': 
    case 'archives': return <DocsHub faction={faction} />;
  }

  // Если это не спец-раздел, ищем документ, который лидер создал в БД
  const doc = await prisma.factionDocument.findUnique({
    where: { factionId_slug: { factionId, slug } }
  });

  if (!doc) {
    return <PlaceholderPage faction={faction} title={pageTitle} slug={slug} />;
  }

  return <DocumentView faction={faction} doc={doc} />;
}
