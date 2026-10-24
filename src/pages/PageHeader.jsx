import { ChevronRight } from 'lucide-react';
import SiteLink from '../components/SiteLink';
export default function PageHeader({ title, eyebrow, children }) { return <section className="page-header"><div className="wrap"><nav className="breadcrumbs" aria-label="Breadcrumb"><SiteLink href="/">Home</SiteLink><ChevronRight size={12} /><span aria-current="page">{eyebrow || title}</span></nav><h1>{title}</h1>{children && <p>{children}</p>}</div></section>; }
