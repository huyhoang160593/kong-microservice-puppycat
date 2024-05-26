import { cn } from '@/misc/utils';
import { useCallback, useEffect, useState } from 'react';
import { PhCheckCircleDuotone } from '../svgs/PhCheckCircleDuotone';
import { PhWarningCircleDuotone } from '../svgs/PhWarningCircleDuotone';
import { PhXCircleDuotone } from '../svgs/PhXCircleDuotone';
import { PhInfoDuotone } from '../svgs/PhInfoDuotone';
import { DISPLAY_ALERT } from '@/constants/eventKey';
import { useDebouncedEffect } from '@react-hookz/web';

const DELAY = 4000;

export function AlertNotification() {
  const [alertList, setAlertList] = useState<AlertDetail[]>([]);
  const onAlertClick = useCallback((index: number) => {
    setAlertList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  useDebouncedEffect(
    () =>
      setAlertList((prev) => {
        if (prev.length === 0) {
          return prev;
        }
        return prev.filter((_, i) => i !== 0);
      }),
    [alertList],
    DELAY
  );

  useEffect(() => {
    function displayAlert(event: CustomEvent<AlertDetail>) {
      setAlertList((prev) => [...prev, event.detail]);
    }
    document.addEventListener(DISPLAY_ALERT, displayAlert);
    return () => {
      document.removeEventListener(DISPLAY_ALERT, displayAlert);
    };
  }, [setAlertList]);

  return (
    <aside className={cn('fixed bottom-0 right-0 p-4')}>
      <dl className={cn("stack")}>
        {alertList.map((alert, index) => (
          <dt
            key={`alert-${alert.type}-${index}`}
            role="alert"
            className={cn('alert cursor-pointer', {
              'alert-success': alert.type === 'success',
              'alert-warning': alert.type === 'warning',
              'alert-error': alert.type === 'error',
              'alert-info': alert.type === 'info',
            })}
            onClick={() => onAlertClick(index)}
          >
            <AlertIcon type={alert.type} className="w-6 h-6" />
            <span>{alert.message}</span>
          </dt>
        ))}
      </dl>
    </aside>
  );
}

interface AlertIconProps extends React.SVGProps<SVGSVGElement> {
  type: AlertDetail['type'];
}
function AlertIcon({ type, ...props }: AlertIconProps) {
  switch (type) {
    case 'success':
      return <PhCheckCircleDuotone {...props} />;
    case 'warning':
      return <PhWarningCircleDuotone {...props} />;
    case 'error':
      return <PhXCircleDuotone {...props} />;
    default:
      return <PhInfoDuotone {...props} />;
  }
}
