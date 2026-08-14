import { ExternalLink, MapPin, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { event } from "../data/event";

type NavigationChooserProps = { open: boolean; onClose: () => void };

export function NavigationChooser({ open, onClose }: NavigationChooserProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="navigation-sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          onKeyDown={(event) => { if (event.key === "Escape") onClose(); }}
        >
          <motion.div
            className="navigation-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="navigation-sheet-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="navigation-sheet-heading">
              <div><span>選擇目的地</span><h2 id="navigation-sheet-title">要導航到哪裡？</h2></div>
              <button type="button" onClick={onClose} aria-label="關閉導航選單" autoFocus><X aria-hidden="true" /></button>
            </div>
            <div className="navigation-destinations">
              {[event.locations.koda, event.locations.amour].map((location) => (
                <a href={location.mapUrl} target="_blank" rel="noreferrer" key={location.name} onClick={onClose}>
                  <span className="navigation-destination-icon"><MapPin aria-hidden="true" /></span>
                  <span><strong>{location.name}</strong><small>{location.address}</small></span>
                  <ExternalLink aria-hidden="true" />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
