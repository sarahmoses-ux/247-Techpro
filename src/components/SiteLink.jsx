import { Link, useLocation } from 'react-router-dom';
import { resolveHref } from '../data/routes';
export default function SiteLink({ href, children, ...props }) {
  const { pathname: currentPath } = useLocation();
  const pathname = currentPath.replace(/\/$/, '') || '/';
  const target = resolveHref(href);
  return target.startsWith('/') ? <Link to={target} aria-current={pathname === target.split('#')[0] ? 'page' : undefined} {...props}>{children}</Link> : <a href={target} {...props}>{children}</a>;
}
