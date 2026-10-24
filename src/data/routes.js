import { services } from './services.js';
export const pages = {
'/': { title:'Technology Solutions for Business & Home', description:'Software, websites, ERP, business IT, solar inverter, CCTV and smart-home solutions. 247TECHPRO helps businesses and individuals plan, implement and maintain the right technology.' },
...Object.fromEntries([['about','About 247TECHPRO'],['services','Our Technology Services'],['solutions','Connected Technology Solutions'],['why-us','Why Choose 247TECHPRO'],['contact','Contact Us'],['request-solution','Request a Solution'],['how-it-works','How We Work'],['faq','Frequently Asked Questions']].map(([id,title])=>['/'+id,{title,description:`${title}. Explore practical technology solutions for businesses and individuals with 247TECHPRO. Your Success, Our Code.`}])),
...Object.fromEntries(services.map(s=>['/services/'+s.id,{title:s.name,description:s.description+' Request a tailored solution from 247TECHPRO.'}]))
};
export const routeFor=id=>id==='home'?'/':id==='consultation'?'/request-solution?service=solar-inverter':id==='inverters'?'/services/solar-inverter#inverters':id==='payment-plans'?'/services/solar-inverter#payment-plans':`/${id}`;
export const resolveHref=href=>/^#(home|about|solutions|how-it-works|payment-plans|faq|contact|consultation|inverters)$/.test(href)?routeFor(href.slice(1)):href;
