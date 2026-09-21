import React, { useEffect, useRef, useState } from 'react';
import { Camera, Check, Crosshair, Loader2, MapPin, X } from 'lucide-react';
import { CATEGORIES } from './constants';
import { useReveal } from '../hooks/useMotion';
import { toast } from './toastBus';

const EMPTY_FORM = { title: '', description: '', category: '', location: '', image: null };

/**
 * Section 03. A single-column form on a hairline panel. Field labels are
 * monospace instrumentation labels; validation speaks in accent-coloured text,
 * never in a red block.
 *
 * The form is always visible — an account is required to FILE, not to type.
 * A signed-out visitor can write the whole report and is asked to sign in when
 * they submit; the draft is held, and the moment the session lands the report
 * files itself. Hiding the form behind a sign-in wall was tried and was wrong:
 * it punished the visitor who had not signed in yet.
 */
export default function ReportSection({ index, label, onSubmit, user, loading, onRequestSignIn }) {
  const ref = useReveal();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // The draft held while the submitter signs in. A ref, not state: it must not
  // re-render the form, and it must survive the modal opening over it.
  const heldDraftRef = useRef(null);

  const readFile = (file) => {
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('That file is not an image. Please drop a PNG or JPG.');
      return;
    }
    readFile(file);
  };

  const validate = () => {
    const next = {};
    if (!formData.title.trim()) next.title = 'A title is required.';
    if (!formData.category) next.category = 'Pick a category.';
    if (!formData.description.trim()) next.description = 'Describe the problem.';
    if (!formData.location.trim()) next.location = 'A location is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /** Sends the draft. The caller owns the write and reports its own failure;
      the form clears itself only once the report is actually on the registry. */
  const fileDraft = async (draft) => {
    setIsSubmitting(true);
    const createdId = await onSubmit(draft);
    setIsSubmitting(false);

    if (!createdId) return;

    setFormData(EMPTY_FORM);
    setImagePreview(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!validate()) {
      toast.error('Some required fields are still empty.');
      return;
    }

    if (!user) {
      if (loading) {
        toast.info('Still checking your session — try again in a moment.');
        return;
      }
      // Hold what they wrote and ask for the account. Filing resumes the
      // moment the session arrives (the effect below).
      heldDraftRef.current = formData;
      onRequestSignIn('Filing a report');
      return;
    }

    fileDraft(formData);
  };

  /* The session arriving after a gated submit: file the held report now. */
  useEffect(() => {
    if (!user || !heldDraftRef.current) return;
    const held = heldDraftRef.current;
    heldDraftRef.current = null;
    fileDraft(held);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- filing the held draft is a one-shot response to the session arriving
  }, [user]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setFormData((prev) => ({
          ...prev,
          location: `Lat: ${coords.latitude.toFixed(4)}, Lng: ${coords.longitude.toFixed(4)}`
        }));
        setErrors((prev) => ({ ...prev, location: undefined }));
        setIsLocating(false);
        toast.success('Location captured.');
      },
      () => {
        setIsLocating(false);
        toast.error('Unable to get location. Please enter it manually.');
      }
    );
  };

  const filled = [formData.title, formData.category, formData.description, formData.location]
    .filter((value) => String(value).trim() !== '').length;
  const completion = (filled / 4) * 100;

  return (
    <section id="report" aria-labelledby="report-title" className="container" style={{ paddingBlock: 'var(--space-section)' }}>
      <div ref={ref}>
        <div className="rule-accent" data-anim="scale-x" aria-hidden="true" />

        <div className="pt-6 sm:pt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="min-w-0">
            <span className="eyebrow" data-anim="fade-up">{index} — {label}</span>
            <h2 id="report-title" className="mt-4 text-body" style={{ fontSize: 'var(--fs-h2)' }} data-anim="mask">
              File a report
            </h2>
          </div>
          <p className="lead md:text-right md:max-w-[26rem] md:flex-shrink-0" data-anim="fade-up">
            Four required fields. The more precise the location, the faster it reaches the
            team that can act on it.
          </p>
        </div>

        <div className="mt-10 sm:mt-14">
          <div className="surface p-6 sm:p-10" data-anim="fade-up">
            {/* Completion meter */}
            <div className="flex items-center gap-4">
              <span className="track flex-1">
                <span className="track-fill" style={{ width: `${completion}%` }} />
              </span>
              <span className="tabular shrink-0" style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)', letterSpacing: '0.14em' }}>
                {filled}/4
              </span>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-9 flex flex-col gap-9" data-anim="stagger">

              {/* Title */}
              <div>
                <label htmlFor="issue-title" className="label">
                  Title <span className="req">*</span>
                </label>
                <input
                  id="issue-title"
                  type="text"
                  value={formData.title}
                  onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                  placeholder="Large pothole outside the community hall"
                  className="field"
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                />
                {errors.title && (
                  <p id="title-error" className="mt-2" style={{ fontSize: 'var(--fs-small)', color: 'var(--accent)' }}>
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Category */}
              <fieldset>
                <legend className="label">
                  Category <span className="req">*</span>
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3" data-anim="stagger">
                  {CATEGORIES.map((category) => {
                    const isSelected = formData.category === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, category: category.id });
                          setErrors((prev) => ({ ...prev, category: undefined }));
                        }}
                        aria-pressed={isSelected}
                        aria-label={`${category.name} (${category.code})`}
                        className="choice"
                      >
                        <span className="tabular shrink-0" aria-hidden="true" style={{ fontSize: 'var(--fs-micro)', color: isSelected ? 'var(--accent)' : 'var(--ink-faint)', letterSpacing: '0.14em' }}>
                          {category.code}
                        </span>
                        <span className="min-w-0" style={{ fontSize: 'var(--fs-small)', fontWeight: 500 }}>
                          {category.name}
                        </span>
                        {isSelected && <Check size={14} strokeWidth={2} className="ml-auto shrink-0" style={{ color: 'var(--accent)' }} aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
                {errors.category && (
                  <p className="mt-2" style={{ fontSize: 'var(--fs-small)', color: 'var(--accent)' }}>{errors.category}</p>
                )}
              </fieldset>

              {/* Description */}
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor="issue-description" className="label">
                    Description <span className="req">*</span>
                  </label>
                  <span className="tabular" style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)' }}>
                    {formData.description.length}
                  </span>
                </div>
                <textarea
                  id="issue-description"
                  rows="4"
                  value={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                  placeholder="What is the problem, how long has it been there, and who does it affect?"
                  className="field"
                  aria-invalid={Boolean(errors.description)}
                />
                {errors.description && (
                  <p className="mt-2" style={{ fontSize: 'var(--fs-small)', color: 'var(--accent)' }}>{errors.description}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label htmlFor="issue-location" className="label">
                  Location <span className="req">*</span>
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1 min-w-0">
                    <MapPin
                      size={15}
                      strokeWidth={1.8}
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: 'var(--ink-faint)' }}
                    />
                    <input
                      id="issue-location"
                      type="text"
                      value={formData.location}
                      onChange={(event) => setFormData({ ...formData, location: event.target.value })}
                      placeholder="Street, landmark or area"
                      className="field"
                      style={{ paddingLeft: '2.25rem' }}
                      aria-invalid={Boolean(errors.location)}
                    />
                  </div>
                  <button type="button" onClick={handleGetLocation} disabled={isLocating} className="btn btn-ghost shrink-0">
                    {isLocating
                      ? <Loader2 size={14} strokeWidth={2} className="anim-spin-slow" style={{ animationDuration: '0.9s' }} aria-hidden="true" />
                      : <Crosshair size={14} strokeWidth={2} aria-hidden="true" />}
                    {isLocating ? 'Locating' : 'Use GPS'}
                  </button>
                </div>
                {errors.location && (
                  <p className="mt-2" style={{ fontSize: 'var(--fs-small)', color: 'var(--accent)' }}>{errors.location}</p>
                )}
              </div>

              {/* Photo */}
              <div>
                <span className="label">Photograph · optional</span>

                {imagePreview ? (
                  <div className="relative overflow-hidden surface" style={{ padding: 0 }}>
                    <img src={imagePreview} alt="Attached report photo" className="h-64 w-full object-cover media-grey" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, image: null });
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      aria-label="Remove photo"
                      className="btn-icon absolute right-3 top-3"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 70%, transparent)', backdropFilter: 'blur(6px)' }}
                    >
                      <X size={15} strokeWidth={2} />
                    </button>
                  </div>
                ) : (
                  <label
                    onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className="flex cursor-pointer flex-col items-start px-6 py-10"
                    style={{
                      border: `1px dashed ${isDragging ? 'var(--accent)' : 'var(--rule-strong)'}`,
                      borderRadius: 'var(--radius)',
                      backgroundColor: isDragging ? 'var(--surface-hover)' : 'transparent',
                      transition: 'border-color 0.25s var(--ease-out), background-color 0.25s var(--ease-out)'
                    }}
                  >
                    <Camera size={18} strokeWidth={1.8} aria-hidden="true" style={{ color: 'var(--ink-faint)' }} />
                    <span className="text-body mt-4" style={{ fontSize: 'var(--fs-small)', fontWeight: 500 }}>
                      {isDragging ? 'Drop the photo to attach it' : 'Click to attach a photo, or drag one here'}
                    </span>
                    <span className="text-faint mt-1" style={{ fontSize: 'var(--fs-micro)', letterSpacing: '0.1em' }}>
                      PNG OR JPG · UP TO 5MB
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(event) => readFile(event.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="pt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderTop: '1px solid var(--rule)', paddingTop: '1.5rem' }}>
                <p className="text-faint" style={{ fontSize: 'var(--fs-small)' }}>
                  Reports are public on the registry. Never include personal details.
                </p>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary shrink-0">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} strokeWidth={2} className="anim-spin-slow" style={{ animationDuration: '0.9s' }} aria-hidden="true" />
                      Filing…
                    </>
                  ) : (
                    'Submit report'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
