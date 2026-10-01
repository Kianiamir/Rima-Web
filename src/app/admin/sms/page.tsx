import {
  getSmsSettingsView,
  listRecentSms,
  listSmsTemplates,
} from "@/modules/sms/actions";
import { SmsSettingsForm } from "./settings-form";
import { SmsTemplatesManager } from "./templates-manager";
import { formatJalaliDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "border-line bg-surface-2 text-muted",
  SENT: "border-accent/40 bg-accent/10 text-accent",
  SANDBOX: "border-primary/40 bg-primary/10 text-primary-soft",
  FAILED: "border-red-500/40 bg-red-500/10 text-red-500",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "در انتظار",
  SENT: "ارسال شد",
  SANDBOX: "آزمایشی",
  FAILED: "خطا",
};

export default async function AdminSmsPage() {
  const [settings, templates, log] = await Promise.all([
    getSmsSettingsView(),
    listSmsTemplates(),
    listRecentSms(20),
  ]);

  return (
    <div className="grid gap-10">
      <div>
        <h1 className="text-2xl font-black">پیامک</h1>
        <p className="mt-2 text-sm text-muted">
          اتصال به سامانهٔ پیامکی (sms.ir)، مدیریت قالب‌ها و گزارش ارسال — همه‌چیز از پنل، بدون
          دست زدن به فایل‌های سرور.
        </p>
      </div>

      <SmsSettingsForm initial={settings} templates={templates} />
      <SmsTemplatesManager templates={templates} />

      <section>
        <h2 className="text-lg font-extrabold">گزارش ارسال</h2>
        <p className="mt-1 text-sm text-muted">آخرین ۲۰ پیامک</p>

        {log.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">
            هنوز پیامکی ارسال نشده است.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-2 text-start text-muted">
                  <th className="p-3 text-start font-semibold">شماره</th>
                  <th className="p-3 text-start font-semibold">قالب</th>
                  <th className="p-3 text-start font-semibold">وضعیت</th>
                  <th className="p-3 text-start font-semibold">زمان</th>
                </tr>
              </thead>
              <tbody>
                {log.map((row) => (
                  <tr key={row.id} className="border-b border-line last:border-0">
                    <td dir="ltr" className="p-3 text-start tabular-nums">
                      0{row.phone.replace(/^\+?98/, "").replace(/^0/, "")}
                    </td>
                    <td className="p-3">
                      <span dir="ltr" className="font-mono text-xs text-muted">
                        {row.templateKey}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block rounded-lg border px-2 py-0.5 text-xs font-bold ${
                          STATUS_STYLES[row.status] ?? STATUS_STYLES.PENDING
                        }`}
                      >
                        {STATUS_LABELS[row.status] ?? row.status}
                      </span>
                      {row.error ? (
                        <p className="mt-1 max-w-56 truncate text-[11px] text-red-500">
                          {row.error}
                        </p>
                      ) : null}
                    </td>
                    <td className="p-3 text-xs text-muted" dir="ltr">
                      {formatJalaliDateTime(row.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
