export const EMAIL = "saneeedotin@gmail.com";

export default function ReachList() {
  return (
    <ul className="reach-list">
      <li><span className="label">Email</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
      <li><span className="label">Instagram</span><a href="https://www.instagram.com/saneeedotin/" target="_blank" rel="noopener">saneeedotin <span aria-hidden="true">↗</span></a></li>
      <li><span className="label">LinkedIn</span><a href="https://www.linkedin.com/search/results/all/?keywords=saneee%20dotin" target="_blank" rel="noopener">saneee.in <span aria-hidden="true">↗</span></a></li>
      <li><span className="label">Where</span>Mumbai, India</li>
    </ul>
  );
}
