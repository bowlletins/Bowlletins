'use client';

import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import swal from 'sweetalert';
import { Form, Button } from 'react-bootstrap';
import { changePassword } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';

type ChangePasswordForm = {
  oldpassword: string;
  password: string;
  confirmPassword: string;
  // acceptTerms: boolean;
};

const ChangePassword = () => {
  const { data: session, status } = useSession();
  const email = session?.user?.email || '';

  const validationSchema = Yup.object().shape({
    oldpassword: Yup.string().required('Password is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    await changePassword({ email, ...data });
    await swal('Password Changed', 'Your password has been changed', 'success', { timer: 2000 });
    reset();
  };

  if (status === 'loading') return <LoadingSpinner />;

  return (
    <div className="change-password-page">
      <div className="change-password-note">
        <div className="change-password-pin" />
        <div className="note-corner-rainbow" />
        <h2 className="change-password-title">Change Password</h2>
        <p className="change-password-subtitle">Update your account password below.</p>
        <hr className="flyer-divider" />

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="change-password-group">
            <Form.Label className="change-password-label">Old Password</Form.Label>
            <input
              type="password"
              {...register('oldpassword')}
              className={`change-password-input form-control ${errors.oldpassword ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.oldpassword?.message}</div>
          </Form.Group>

          <Form.Group className="change-password-group">
            <Form.Label className="change-password-label">New Password</Form.Label>
            <input
              type="password"
              {...register('password')}
              className={`change-password-input form-control ${errors.password ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </Form.Group>

          <Form.Group className="change-password-group">
            <Form.Label className="change-password-label">Confirm Password</Form.Label>
            <input
              type="password"
              {...register('confirmPassword')}
              className={`change-password-input form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
          </Form.Group>

          <div className="change-password-buttons">
            <Button type="submit" className="change-password-btn-confirm">
              Change Password
            </Button>
            <Button type="button" onClick={() => reset()} className="change-password-btn-reset">
              Reset
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
