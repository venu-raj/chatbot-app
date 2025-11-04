import { Switch } from "@workspace/ui/components/switch";

export default function UpdateSubscription() {
  const subscribe = async (checked: boolean) => {};

  return (
    <div className="flex items-center gap-x-2">
      <Switch
        checked={false}
        loading={false}
        fn={(checked: boolean) => {
          // update(() => subscribe(checked), { subscribed: checked });
        }}
      />
      <p className="text-sm text-neutral-500">Subscribed to product updates</p>
    </div>
  );
}
